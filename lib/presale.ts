// Reglas de la preventa. Sin dependencias de servidor: las usan el carrito, las fichas y el checkout.
// Las fechas y condiciones se editan desde el admin (Preventa); acá están los valores por defecto.

export type PresaleConfig = {
  /** Interruptor general: apagada, no hay sellos ni regalo aunque esté en fecha */
  enabled: boolean;
  /** Primer día, YYYY-MM-DD (desde las 00:00 hora Argentina) */
  startsOn: string;
  /** Último día, YYYY-MM-DD inclusive (hasta las 23:59 hora Argentina) */
  endsOn: string;
  /** Desde cuándo se despachan los pedidos de preventa. Vacío = sin definir */
  shipsFrom: string;
  /** Categoría que da derecho al regalo */
  qualifyingCategory: string;
  /** Un regalo por cada unidad que califica (false = uno por pedido) */
  perUnit: boolean;
};

export const DEFAULT_PRESALE: PresaleConfig = {
  enabled: true,
  startsOn: "2026-12-01",
  endsOn: "2026-12-20",
  shipsFrom: "",
  qualifyingCategory: "Mousepads",
  perUnit: true,
};

/** El regalo: datos fijos de Tiendanube (el producto oculto a $0 y la manga real). */
export const PRESALE_GIFT = {
  /** Producto oculto en Tiendanube a $0, solo para regalar. Su stock es el tope de regalos */
  productId: "383521286",
  variantId: 1646962922,
  /** Producto real del que es regalo: de acá sale el valor que "ahorra" el cliente */
  sourceProductId: "383012940",
  name: "Manga de compresión",
} as const;

export const presaleStart = (c: PresaleConfig) => new Date(`${c.startsOn}T00:00:00-03:00`).getTime();
export const presaleEnd = (c: PresaleConfig) => new Date(`${c.endsOn}T23:59:59.999-03:00`).getTime();

export type PresaleStatus = "apagada" | "programada" | "al-aire" | "terminada";

export function presaleStatus(c: PresaleConfig, now = Date.now()): PresaleStatus {
  if (!c.enabled) return "apagada";
  if (now < presaleStart(c)) return "programada";
  if (now > presaleEnd(c)) return "terminada";
  return "al-aire";
}

export const isPresaleOpen = (c: PresaleConfig, now = Date.now()) => presaleStatus(c, now) === "al-aire";

export const qualifiesForGift = (c: PresaleConfig, category?: string) =>
  Boolean(category) && category!.trim().toLowerCase() === c.qualifyingCategory.trim().toLowerCase();

/** Cuántos regalos corresponden según lo que hay en el pedido. */
export function giftsFor(c: PresaleConfig, items: { category?: string; quantity: number }[]): number {
  const units = items
    .filter((i) => qualifiesForGift(c, i.category))
    .reduce((acc, i) => acc + Math.max(0, i.quantity), 0);
  if (units === 0) return 0;
  return c.perUnit ? units : 1;
}

/** ¿El pedido se hizo durante la preventa? */
export const isPresaleDate = (c: PresaleConfig, iso: string) => {
  const t = new Date(iso).getTime();
  return t >= presaleStart(c) && t <= presaleEnd(c);
};

export type GiftInfo = {
  quantity: number;
  name: string;
  image: string;
  /** Precio de la manga real, para mostrar el ahorro */
  value: number;
  endsOn: string;
  shipsFrom: string;
  /** Regalos que quedan (null = sin tope) */
  remaining: number | null;
};
