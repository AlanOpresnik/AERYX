// Fecha de apertura de la web: 1 de diciembre, 00:00 hora Argentina
export const LAUNCH_DATE = "2026-12-01T00:00:00-03:00";

export const isLaunched = (now: number = Date.now()) =>
  now >= new Date(LAUNCH_DATE).getTime();

// Cookie que permite ver el sitio completo antes de la apertura
export const PREVIEW_COOKIE = "aeryx_preview";
