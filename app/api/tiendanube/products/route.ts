import { NextRequest, NextResponse } from "next/server";
import { tiendanube } from "@/lib/tiendanube/client";
import { mapProducts } from "@/lib/tiendanube/product-mapper";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category_id = searchParams.get("category_id") ? Number(searchParams.get("category_id")) : undefined;
    const q = searchParams.get("q") || undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;
    const per_page = searchParams.get("per_page") ? Number(searchParams.get("per_page")) : 200;

    const tnProducts = await tiendanube.getProducts({
      category_id,
      q,
      page,
      per_page,
      published: true,
    });

    const mappedProducts = mapProducts(tnProducts);
    return NextResponse.json(mappedProducts);
  } catch (error: any) {
    console.error("[Tiendanube API] Error fetching products:", error);
    
    // Check if it's a rate limit error (usually 429 or mapped to 503 by client)
    const status = error.status || 500;
    return NextResponse.json(
      { error: "Error fetching products", details: error.message },
      { status }
    );
  }
}
