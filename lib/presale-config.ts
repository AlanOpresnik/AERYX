import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import { DEFAULT_PRESALE, type PresaleConfig } from "@/lib/presale";
import { readStoreKey, writeStoreKey } from "@/lib/superadmin-store";

const TAG = "presale";
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function parse(raw: unknown): PresaleConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<PresaleConfig>;
  return {
    enabled: typeof r.enabled === "boolean" ? r.enabled : DEFAULT_PRESALE.enabled,
    startsOn: r.startsOn && DATE.test(r.startsOn) ? r.startsOn : DEFAULT_PRESALE.startsOn,
    endsOn: r.endsOn && DATE.test(r.endsOn) ? r.endsOn : DEFAULT_PRESALE.endsOn,
    shipsFrom: r.shipsFrom && DATE.test(r.shipsFrom) ? r.shipsFrom : "",
    qualifyingCategory: r.qualifyingCategory?.trim() || DEFAULT_PRESALE.qualifyingCategory,
    perUnit: typeof r.perUnit === "boolean" ? r.perUnit : DEFAULT_PRESALE.perUnit,
  };
}

/** Lectura directa (admin). */
export async function readPresaleConfig(): Promise<PresaleConfig> {
  return parse(await readStoreKey("presale"));
}

// Los errores no se guardan en la caché (salen de la función)
const readCached = unstable_cache(readPresaleConfig, ["presale-v1"], { tags: [TAG], revalidate: 300 });

/** Configuración vigente. Si no se puede leer, rige la de por defecto. */
export async function getPresaleConfig(): Promise<PresaleConfig> {
  try {
    return await readCached();
  } catch (error) {
    console.error("[Preventa] No se pudo leer la configuración:", error);
    return DEFAULT_PRESALE;
  }
}

export async function writePresaleConfig(config: PresaleConfig): Promise<void> {
  await writeStoreKey("presale", parse(config));
  revalidateTag(TAG, { expire: 0 });
}
