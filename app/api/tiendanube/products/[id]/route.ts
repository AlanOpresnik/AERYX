import { NextRequest, NextResponse } from "next/server";
import { tiendanube } from "@/lib/tiendanube/client";
import { mapProduct } from "@/lib/tiendanube/product-mapper";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tnProduct = await tiendanube.getProductById(Number(id));
    
    if (!tnProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const mappedProduct = mapProduct(tnProduct);
    return NextResponse.json(mappedProduct);
  } catch (error: any) {
    console.error(`[Tiendanube API] Error fetching product:`, error);
    const status = error.status || 500;
    
    if (status === 404) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "Error fetching product", details: error.message },
      { status }
    );
  }
}
