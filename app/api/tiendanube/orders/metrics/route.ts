import { NextResponse } from "next/server";
import { tiendanube } from "@/lib/tiendanube/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch recent orders (last 200)
    const orders = await tiendanube.getOrders({ per_page: 200 });

    const paidOrders = orders.filter(
      (o) => o.payment_status === "paid" || o.payment_status === "partially_refunded",
    );

    const netSales = paidOrders.reduce(
      (sum, o) => sum + parseFloat(o.total || "0"),
      0,
    );

    const averageTicket = paidOrders.length > 0 ? netSales / paidOrders.length : 0;

    return NextResponse.json({
      success: true,
      metrics: {
        netSales: Math.round(netSales * 100) / 100,
        orders: paidOrders.length,
        averageTicket: Math.round(averageTicket * 100) / 100,
        totalOrders: orders.length,
      },
    });
  } catch (error) {
    console.error("[Orders Metrics] Error:", error);
    return NextResponse.json(
      { success: false, metrics: { netSales: 0, orders: 0, averageTicket: 0, totalOrders: 0 } },
      { status: 500 },
    );
  }
}
