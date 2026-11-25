import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser, isSuperadminUser, primaryEmail } from "@/lib/auth/superadmin";
import { tiendanube } from "@/lib/tiendanube/client";
import { toLegacyOrder } from "@/lib/tiendanube/order-legacy";
import type { TiendanubeOrderFull } from "@/lib/tiendanube/types";

export const dynamic = "force-dynamic";

/** Un pedido: solo su dueño o el superadmin. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const user = userId ? await getCurrentUser() : null;
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  try {
    const order = (await tiendanube.getOrderById(id)) as TiendanubeOrderFull;
    const owner = (order.customer?.email || order.contact_email || "").toLowerCase();
    const email = primaryEmail(user);
    if (!isSuperadminUser(user) && (!email || owner !== email)) {
      // 404 y no 403: no confirma que el pedido exista
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(toLegacyOrder(order));
  } catch {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
}
