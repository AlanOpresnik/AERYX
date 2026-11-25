// Tipos y reglas de los anuncios. Sin dependencias de servidor: lo usa también la barra de la web.

export type Announcement = {
  id: string;
  message: string;
  linkLabel: string;
  linkHref: string;
  /** YYYY-MM-DD, hora de Argentina. Vacío = desde ya */
  startsOn: string;
  /** YYYY-MM-DD inclusive, hora de Argentina. Vacío = sin fecha de fin */
  endsOn: string;
  active: boolean;
  updatedAt: string;
  /** Categoría que activa el aviso en el carrito (ej. "Mousepads"). Vacío = sin aviso */
  cartTrigger?: string;
  /** Texto del carrito cuando el pedido califica */
  cartNote?: string;
};

export type AnnouncementStatus = "activo" | "programado" | "vencido" | "pausado";

/** Inicio y fin del día en Argentina (UTC−3, sin horario de verano). */
export const dayStart = (d: string) => new Date(`${d}T00:00:00-03:00`).getTime();
export const dayEnd = (d: string) => new Date(`${d}T23:59:59.999-03:00`).getTime();

export function announcementStatus(a: Announcement, now = Date.now()): AnnouncementStatus {
  if (a.endsOn && now > dayEnd(a.endsOn)) return "vencido";
  if (!a.active) return "pausado";
  if (a.startsOn && now < dayStart(a.startsOn)) return "programado";
  return "activo";
}


/** Días que faltan hasta el final del anuncio (0 = termina hoy). Null si no tiene fin. */
export function daysLeft(a: Announcement, now = Date.now()): number | null {
  if (!a.endsOn) return null;
  return Math.max(0, Math.floor((dayEnd(a.endsOn) - now) / 86_400_000));
}

/** El que se muestra: el primero de la lista que esté al aire ahora. */
export function currentAnnouncement(list: Announcement[], now = Date.now()): Announcement | null {
  return list.find((a) => announcementStatus(a, now) === "activo") ?? null;
}

/**
 * Promo con regalo que aplica al carrito: el primer anuncio al aire que tenga categoría.
 * `qualifies` dice si algún producto del carrito es de esa categoría.
 */
export function cartPromo(
  list: Announcement[],
  categories: string[],
  now = Date.now(),
): { announcement: Announcement; qualifies: boolean } | null {
  const promo = list.find((a) => a.cartTrigger?.trim() && announcementStatus(a, now) === "activo");
  if (!promo) return null;
  const trigger = promo.cartTrigger!.trim().toLowerCase();
  return { announcement: promo, qualifies: categories.some((c) => c.trim().toLowerCase() === trigger) };
}
