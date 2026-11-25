"use server";

import { revalidatePath } from "next/cache";
import { checkSuperadmin } from "@/lib/auth/superadmin";
import { tiendanube } from "@/lib/tiendanube/client";
import { revalidateProducts } from "@/lib/tiendanube/cache";

/** Publica u oculta un producto en la tienda. */
export async function setProductPublished(
  productId: number,
  published: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const access = await checkSuperadmin();
  if (!access.ok) return { ok: false, error: access.error };
  if (!Number.isInteger(productId)) return { ok: false, error: "Producto inválido." };

  try {
    await tiendanube.updateProduct(productId, { published });
    revalidateProducts();
    revalidatePath("/admin/productos");
    return { ok: true };
  } catch (error) {
    console.error("[Admin] setProductPublished:", error);
    const denied = error instanceof Error && /Error (401|403)/.test(error.message);
    return {
      ok: false,
      error: denied
        ? "La app de Tiendanube no tiene permiso para editar productos (write_products)."
        : "No se pudo actualizar el producto. Probá de nuevo.",
    };
  }
}
