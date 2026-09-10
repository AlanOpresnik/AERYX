import { NextRequest, NextResponse } from "next/server";
import { tiendanube } from "@/lib/tiendanube/client";

export async function GET(request: NextRequest) {
  try {
    const categories = await tiendanube.getCategories({ per_page: 200 });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("[Tiendanube API] Error fetching categories:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: "Error fetching categories", details: error.message },
      { status }
    );
  }
}
