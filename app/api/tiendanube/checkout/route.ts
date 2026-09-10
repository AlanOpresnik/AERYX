import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, contactEmail, contactName, contactLastname } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, message: "No items provided" }, { status: 400 });
    }

    const STORE_ID = process.env.TIENDANUBE_STORE_ID;
    const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;

    if (!STORE_ID || !ACCESS_TOKEN) {
      return NextResponse.json({ success: false, message: "Missing Tiendanube credentials" }, { status: 500 });
    }

    const apiUrl = `https://api.tiendanube.com/v1/${STORE_ID}/draft_orders`;
    const draftOrderPayload = {
      contact_email: contactEmail || undefined,
      contact_name: contactName || undefined,
      contact_lastname: contactLastname || undefined,
      products: items.map((item: any) => ({
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'Aeryx App (app@aeryx.com)',
      },
      body: JSON.stringify(draftOrderPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Tiendanube Draft Order error:", data);
      return NextResponse.json({ success: false, message: "Failed to create checkout" }, { status: res.status });
    }

    return NextResponse.json({ success: true, checkoutUrl: data.checkout_url });
  } catch (error) {
    console.error("Draft order exception:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
