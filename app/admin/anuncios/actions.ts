"use server";

import { revalidatePath } from "next/cache";
import { checkSuperadmin } from "@/lib/auth/superadmin";
import {
  MAX_ANNOUNCEMENTS,
  readAnnouncements,
  writeAnnouncements,
  type Announcement,
} from "@/lib/announcements";

export type FormState =
  | { status: "idle" }
  | { status: "saved"; id: string; at: number }
  | { status: "error"; message: string; fields?: Record<string, string> };

type Result = { ok: true } | { ok: false; error: string };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function failure(error: unknown): string {
  console.error("[Anuncios]", error);
  return error instanceof Error && /superadmin/.test(error.message)
    ? error.message
    : "No se pudo guardar. Probá de nuevo en un momento.";
}

function done() {
  revalidatePath("/admin/anuncios");
}

export async function saveAnnouncement(_prev: FormState, form: FormData): Promise<FormState> {
  const access = await checkSuperadmin();
  if (!access.ok) return { status: "error", message: access.error };

  const get = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  const id = get("id", 40);
  const message = get("message", 160);
  const linkLabel = get("linkLabel", 30);
  const linkHref = get("linkHref", 300);
  const startsOn = get("startsOn", 10);
  const endsOn = get("endsOn", 10);
  const active = form.get("active") === "on";
  const cartTrigger = get("cartTrigger", 60);
  const cartNote = get("cartNote", 120);

  const fields: Record<string, string> = {};
  if (!message) fields.message = "Escribí el texto del anuncio.";
  if (linkLabel && !linkHref) fields.linkHref = "Falta a dónde lleva el link.";
  if (linkHref && !linkLabel) fields.linkLabel = "Falta el texto del link.";
  if (linkHref && !/^\/(?!\/)/.test(linkHref) && !/^https:\/\//.test(linkHref)) {
    fields.linkHref = "Usá una ruta de la web (ej. /catalog) o una dirección que empiece con https://";
  }
  if (cartTrigger && !cartNote) fields.cartNote = "Escribí qué ve el cliente en el carrito.";
  if (startsOn && !DATE.test(startsOn)) fields.startsOn = "Fecha inválida.";
  if (endsOn && !DATE.test(endsOn)) fields.endsOn = "Fecha inválida.";
  if (startsOn && endsOn && endsOn < startsOn) fields.endsOn = "Termina antes de empezar.";
  if (Object.keys(fields).length) return { status: "error", message: "Revisá los campos marcados.", fields };

  try {
    const list = await readAnnouncements();
    const next: Announcement = {
      id: id || crypto.randomUUID().slice(0, 8),
      message,
      linkLabel,
      linkHref,
      startsOn,
      endsOn,
      active,
      cartTrigger,
      cartNote: cartTrigger ? cartNote : "",
      updatedAt: new Date().toISOString(),
    };
    const exists = list.some((a) => a.id === next.id);
    if (!exists && list.length >= MAX_ANNOUNCEMENTS) {
      return { status: "error", message: `Podés tener hasta ${MAX_ANNOUNCEMENTS} anuncios. Borrá uno viejo.` };
    }
    // Los nuevos van primero: el primero activo es el que se muestra
    await writeAnnouncements(exists ? list.map((a) => (a.id === next.id ? next : a)) : [next, ...list]);
    done();
    return { status: "saved", id: next.id, at: Date.now() };
  } catch (error) {
    return { status: "error", message: failure(error) };
  }
}

async function mutate(fn: (list: Announcement[]) => Announcement[]): Promise<Result> {
  const access = await checkSuperadmin();
  if (!access.ok) return { ok: false, error: access.error };
  try {
    await writeAnnouncements(fn(await readAnnouncements()));
    done();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: failure(error) };
  }
}

export async function setAnnouncementActive(id: string, active: boolean): Promise<Result> {
  return mutate((list) =>
    list.map((a) => (a.id === id ? { ...a, active, updatedAt: new Date().toISOString() } : a)),
  );
}

export async function deleteAnnouncement(id: string): Promise<Result> {
  return mutate((list) => list.filter((a) => a.id !== id));
}

/** Lo pasa al primer lugar: entre varios activos, se muestra el de arriba. */
export async function prioritizeAnnouncement(id: string): Promise<Result> {
  return mutate((list) => {
    const item = list.find((a) => a.id === id);
    return item ? [item, ...list.filter((a) => a.id !== id)] : list;
  });
}
