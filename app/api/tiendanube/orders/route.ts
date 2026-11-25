import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser, isSuperadminUser, primaryEmail } from "@/lib/auth/superadmin";
import { tiendanube } from "@/lib/tiendanube/client";
import { toLegacyOrder } from "@/lib/tiendanube/order-legacy";

export const dynamic = "force-dynamic";

/**
 * Pedidos de la cuenta con sesión iniciada.
 * El mail sale de la sesión de Clerk, nunca de la URL: antes cualquiera podía
 * pedir ?email=<otro> o, sin parámetro, todos los pedidos de la tienda.
 * El superadmin puede listar todos pidiendo ?all=1.
 */
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const per_page = Math.min(200, Math.max(1, Number(searchParams.get("per_page")) || 20));

    if (searchParams.get("all") === "1" && isSuperadminUser(user)) {
      const { items } = await tiendanube.getOrdersPage({ page, per_page });
      return NextResponse.json(items.map(toLegacyOrder));
    }

    const email = primaryEmail(user);
    if (!email) return NextResponse.json([]);

    // q busca por coincidencia parcial: hay que quedarse solo con el mail exacto
    const { items: customers } = await tiendanube.getCustomersPage({ q: email, per_page: 50 });
    const customer = customers.find((c) => c.email?.toLowerCase() === email);
    if (!customer) return NextResponse.json([]);

    const { items } = await tiendanube.getOrdersPage({ customer_ids: customer.id, page, per_page });
    return NextResponse.json(
      items
        .filter((o) => (o.customer?.email || o.contact_email || "").toLowerCase() === email)
        .map(toLegacyOrder),
    );
  } catch (error) {
    console.error("[Orders] Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
