import { NextResponse } from "next/server";
import { tiendanube } from "@/lib/tiendanube/client";
import { buildOrderProducts } from "@/lib/presale-server";
import { PRESALE_GIFT } from "@/lib/presale";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Crea el pedido en Tiendanube y devuelve el link de pago.
 * El regalo de preventa lo agrega el servidor: el cliente no puede pedirlo suelto.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const items = Array.isArray(body?.items) ? body.items.slice(0, 50) : [];
    const contactEmail = String(body?.contactEmail ?? "").trim();

    if (!items.length) {
      return NextResponse.json({ success: false, message: "El carrito está vacío." }, { status: 400 });
    }
    if (!EMAIL.test(contactEmail)) {
      return NextResponse.json({ success: false, message: "Ingresá un mail válido para seguir." }, { status: 400 });
    }

    const { products, gift, dropped } = await buildOrderProducts(
      items.map((i: { variantId?: unknown; quantity?: unknown }) => ({
        variantId: Number(i?.variantId),
        quantity: Number(i?.quantity),
      })),
    );
    if (dropped > 0 || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Algún producto del carrito ya no está disponible. Revisá el carrito." },
        { status: 409 },
      );
    }

    const contact = {
      contact_email: contactEmail,
      contact_name: String(body?.contactName ?? "").trim().slice(0, 60) || undefined,
      contact_lastname: String(body?.contactLastname ?? "").trim().slice(0, 60) || undefined,
    };

    try {
      const order = await tiendanube.createDraftOrder({ ...contact, products });
      return NextResponse.json({
        success: true,
        checkoutUrl: order.checkout_url,
        // Para la página de compra exitosa: el token impide ver pedidos ajenos
        orderId: order.id,
        orderToken: order.token,
        giftIncluded: gift?.quantity ?? 0,
      });
    } catch (error) {
      // Si falla con el regalo (por ejemplo, se acabaron justo), se reintenta sin él
      // para no perder la venta, y se avisa al cliente.
      if (gift && gift.quantity > 0) {
        console.error("[Checkout] Falló con el regalo, reintento sin él:", error);
        const withoutGift = products.filter((p) => p.variant_id !== PRESALE_GIFT.variantId);
        const order = await tiendanube.createDraftOrder({ ...contact, products: withoutGift });
        return NextResponse.json({
          success: true,
          checkoutUrl: order.checkout_url,
          orderId: order.id,
          orderToken: order.token,
          giftIncluded: 0,
          giftUnavailable: true,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("[Checkout] Error creando el pedido:", error);
    return NextResponse.json({ success: false, message: "No pudimos iniciar el pago. Probá de nuevo." }, { status: 500 });
  }
}
