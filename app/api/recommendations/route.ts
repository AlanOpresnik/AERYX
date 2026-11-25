import { NextResponse } from "next/server";
import { suggestForCart } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

/** Sugerencias para el carrito. Solo recibe ids y subtotales; no requiere sesión. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const items = Array.isArray(body?.items) ? body.items.slice(0, 30) : [];
    const cart = items
      .map((i: { productId?: unknown; subtotal?: unknown }) => ({
        productId: String(i?.productId ?? ""),
        subtotal: Math.max(0, Number(i?.subtotal) || 0),
      }))
      .filter((i: { productId: string }) => /^\d{1,20}$/.test(i.productId));

    const suggestions = await suggestForCart(cart);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("[Sugerencias] Error:", error);
    // Las sugerencias nunca deben romper el carrito
    return NextResponse.json({ suggestions: [] });
  }
}
