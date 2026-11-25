import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import { readStoreKey, writeStoreKey } from "@/lib/superadmin-store";
import { announcementStatus, type Announcement } from "@/lib/announcement-utils";

export { announcementStatus, type Announcement, type AnnouncementStatus } from "@/lib/announcement-utils";

/**
 * Anuncios de la barra superior de la web.
 *
 * Dónde se guardan: en la metadata privada de la cuenta superadmin de Clerk.
 * No hace falta una base de datos y solo esa cuenta puede escribirlos.
 * Límite de Clerk: 8 KB, de sobra para unos cuantos anuncios.
 */
export const MAX_ANNOUNCEMENTS = 10;
const TAG = "announcements";

function parse(raw: unknown): Announcement[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((a): a is Announcement => Boolean(a && typeof a === "object" && typeof (a as Announcement).id === "string"))
    .slice(0, MAX_ANNOUNCEMENTS);
}

/** Lectura directa (para el admin, siempre fresca). */
export async function readAnnouncements(): Promise<Announcement[]> {
  return parse(await readStoreKey("announcements"));
}

/** Lectura para la web pública: cacheada 10 minutos y refrescada al guardar desde el admin. */
// Si la lectura falla, el error sale de la caché sin guardarse: así un fallo
// momentáneo no deja la barra vacía durante 10 minutos.
const readCached = unstable_cache(readAnnouncements, ["announcements-v2"], { tags: [TAG], revalidate: 600 });

/**
 * Anuncios que pueden estar al aire en las próximas horas. La web decide en el navegador
 * cuál mostrar según la hora real, así un anuncio programado arranca a tiempo
 * aunque la página esté cacheada.
 */
export async function getPublicAnnouncements(): Promise<Announcement[]> {
  let list: Announcement[] = [];
  try {
    list = await readCached();
  } catch (error) {
    console.error("[Anuncios] No se pudieron leer:", error);
  }
  return list.filter((a) => a.active && announcementStatus(a) !== "vencido");
}

export async function writeAnnouncements(list: Announcement[]): Promise<void> {
  await writeStoreKey("announcements", list.slice(0, MAX_ANNOUNCEMENTS));
  revalidateTag(TAG, { expire: 0 });
}
