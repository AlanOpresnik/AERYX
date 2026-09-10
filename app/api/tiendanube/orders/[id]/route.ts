import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const STORE_ID = process.env.TIENDANUBE_STORE_ID;
    const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;

    const apiUrl = `https://api.tiendanube.com/v1/${STORE_ID}/orders/${id}`;

    const res = await fetch(apiUrl, {
      headers: {
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'Aeryx App (app@aeryx.com)',
      }
    });
    
    const o = await res.json();
    if (!res.ok) throw new Error(o.message || 'Error fetching order');

    const order = {
      _id: String(o.id),
      customer: {
        firstName: o.customer?.name?.split(' ')[0] || '',
        lastName: o.customer?.name?.split(' ').slice(1).join(' ') || '',
        email: o.customer?.email || '',
        phone: o.customer?.phone || '',
      },
      shippingAddress: {
        address: o.shipping_address?.address || '',
        addressNumber: o.shipping_address?.number || '',
        city: o.shipping_address?.city || '',
        postalCode: o.shipping_address?.zipcode || '',
        province: o.shipping_address?.province || '',
      },
      items: (o.products || []).map((p: any) => ({
        productId: String(p.product_id),
        name: p.name,
        image: p.image?.src || '',
        price: parseFloat(p.price) || 0,
        quantity: p.quantity,
        subtotal: (parseFloat(p.price) || 0) * p.quantity,
      })),
      shipping: {
        method: o.shipping_option || null,
        cost: parseFloat(o.shipping_cost_owner) || 0,
      },
      totals: {
        subtotal: parseFloat(o.subtotal) || 0,
        shipping: parseFloat(o.shipping_cost_owner) || 0,
        total: parseFloat(o.total) || 0,
      },
      payment: {
        method: o.gateway_name || 'unknown',
        status: o.payment_status || 'unknown',
      },
      status: o.status || 'unknown',
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    };

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
