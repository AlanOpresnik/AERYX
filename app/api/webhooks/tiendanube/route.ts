import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  revalidateProducts,
  revalidateOrders,
  revalidateCategories,
} from "@/lib/tiendanube/cache";

export const dynamic = "force-dynamic";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.TIENDANUBE_CLIENT_SECRET;
  if (!secret) {
    console.error("[Webhook] TIENDANUBE_CLIENT_SECRET not configured");
    return false;
  }

  const calculated = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculated),
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-linkedstore-hmac-sha256");

    // Verify webhook signature
    if (signature && !verifySignature(rawBody, signature)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event as string;

    console.log(`[Webhook] Received event: ${event}`);

    // Revalidate caches based on event type
    if (event?.startsWith("product/")) {
      revalidateProducts();
      console.log("[Webhook] Revalidated products cache");
    } else if (event?.startsWith("order/")) {
      revalidateOrders();
      console.log("[Webhook] Revalidated orders cache");
    } else if (event?.startsWith("category/")) {
      revalidateCategories();
      console.log("[Webhook] Revalidated categories cache");
    }

    // Respond quickly (Tiendanube requires < 3 seconds)
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
