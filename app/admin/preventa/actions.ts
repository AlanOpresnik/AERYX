"use server";

import { revalidatePath } from "next/cache";
import { checkSuperadmin } from "@/lib/auth/superadmin";
import { PRESALE_GIFT } from "@/lib/presale";
import { readPresaleConfig, writePresaleConfig } from "@/lib/presale-config";
import { tiendanube } from "@/lib/tiendanube/client";
import { revalidateProducts } from "@/lib/tiendanube/cache";

export type PresaleFormState =
  | { status: "idle" }
  | { status: "saved"; at: number }
  | { status: "error"; message: string; fields?: Record<string, string> };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function savePresale(_prev: PresaleFormState, form: FormData): Promise<PresaleFormState> {
  const access = await checkSuperadmin();
  if (!access.ok) return { status: "error", message: access.error };

  const get = (k: string) => String(form.get(k) ?? "").trim();
  const startsOn = get("startsOn");
  const endsOn = get("endsOn");
  const shipsFrom = get("shipsFrom");
  const qualifyingCategory = get("qualifyingCategory").slice(0, 60);
  const stockRaw = get("giftStock");
  const stockChanged = form.get("giftStockTouched") === "1";

  const fields: Record<string, string> = {};
  if (!DATE.test(startsOn)) fields.startsOn = "Elegí el primer día.";
  if (!DATE.test(endsOn)) fields.endsOn = "Elegí el último día.";
  if (DATE.test(startsOn) && DATE.test(endsOn) && endsOn < startsOn) fields.endsOn = "Termina antes de empezar.";
  if (shipsFrom && !DATE.test(shipsFrom)) fields.shipsFrom = "Fecha inválida.";
  if (!qualifyingCategory) fields.qualifyingCategory = "Elegí qué categoría da el regalo.";
  const stock = stockRaw === "" ? null : Number(stockRaw);
  if (stock !== null && (!Number.isInteger(stock) || stock < 0 || stock > 100000)) {
    fields.giftStock = "Usá un número entero (o dejalo vacío para no poner tope).";
  }
  if (Object.keys(fields).length) return { status: "error", message: "Revisá los campos marcados.", fields };

  try {
    const current = await readPresaleConfig();
    await writePresaleConfig({
      ...current,
      enabled: form.get("enabled") === "on",
      startsOn,
      endsOn,
      shipsFrom,
      qualifyingCategory,
      perUnit: form.get("perUnit") !== "order",
    });
    // El tope de regalos es el stock del producto oculto en Tiendanube
    if (stockChanged) {
      await tiendanube.updateVariantStock(Number(PRESALE_GIFT.productId), PRESALE_GIFT.variantId, stock);
      revalidateProducts();
    }
    revalidatePath("/admin/preventa");
    return { status: "saved", at: Date.now() };
  } catch (error) {
    console.error("[Preventa] Error guardando:", error);
    const denied = error instanceof Error && /Error (401|403)/.test(error.message);
    return {
      status: "error",
      message: denied
        ? "Tiendanube no dejó cambiar el stock del regalo (falta el permiso write_products)."
        : error instanceof Error && /superadmin/.test(error.message)
          ? error.message
          : "No se pudo guardar. Probá de nuevo.",
    };
  }
}
