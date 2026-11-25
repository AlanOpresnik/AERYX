// El último pedido que el cliente fue a pagar a Tiendanube.
// Sirve para mostrarle la confirmación cuando vuelve a la web.

const KEY = "aeryx:pedido-pendiente";
const MAX_AGE = 3 * 24 * 60 * 60 * 1000;

export type PendingOrder = { id: number; token: string; at: number };

export function rememberPendingOrder(order: { id: number; token: string }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...order, at: Date.now() }));
  } catch {}
}

export function readPendingOrder(): PendingOrder | null {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw?.id || !raw?.token || Date.now() - raw.at > MAX_AGE) return null;
    return raw;
  } catch {
    return null;
  }
}

export function forgetPendingOrder() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export const confirmationUrl = (o: { id: number; token: string }) =>
  `/checkout/gracias?orden=${o.id}&t=${encodeURIComponent(o.token)}`;
