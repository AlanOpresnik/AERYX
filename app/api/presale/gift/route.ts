import { NextResponse } from "next/server";
import { giftForCart } from "@/lib/presale-server";

export const dynamic = "force-dynamic";

/** Qué regalo de preventa le toca a un carrito. Solo lectura. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const items = (Array.isArray(body?.items) ? body.items.slice(0, 50) : [])
      .map((i: { variantId?: unknown; quantity?: unknown }) => ({ variantId: Number(i?.variantId), quantity: Number(i?.quantity) }))
      .filter((i: { variantId: number; quantity: number }) => Number.isInteger(i.variantId) && i.quantity > 0);
    return NextResponse.json({ gift: await giftForCart(items) });
  } catch (error) {
    console.error("[Preventa] Error calculando el regalo:", error);
    return NextResponse.json({ gift: null });
  }
}
