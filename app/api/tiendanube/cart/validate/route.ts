import { NextRequest, NextResponse } from "next/server";
import { tiendanube } from "@/lib/tiendanube/client";
import { mapProduct } from "@/lib/tiendanube/product-mapper";
import { CheckoutItem } from "@/lib/interface/cart";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: { productId: string; variantId?: number; quantity: number }[] };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid items format" },
        { status: 400 }
      );
    }

    const validatedItems: CheckoutItem[] = [];

    for (const item of items) {
      try {
        const numericId = Number(item.productId);
        
        // Skip invalid IDs (like old MongoDB ObjectIds)
        if (isNaN(numericId) || numericId <= 0) {
          console.warn(`[Cart Validate] Skipping invalid product ID: ${item.productId}`);
          continue;
        }

        const tnProduct = await tiendanube.getProductById(numericId).catch(() => null);
        
        if (!tnProduct) {
          console.warn(`[Cart Validate] Product ${numericId} not found in Tiendanube`);
          continue; // Skip products that no longer exist
        }

        const product = mapProduct(tnProduct);
        
        let variantId = item.variantId;
        let variantName = "";
        let price = product.price;
        let stock = product.stock;

        if (product.variants && product.variants.length > 0) {
          const variant = variantId 
            ? product.variants.find(v => v.id === variantId)
            : product.variants[0];
            
          if (variant) {
            variantId = variant.id;
            variantName = variant.values.map(v => v.value).join(" / ");
            price = variant.promotionalPrice || variant.price;
            stock = variant.stock ?? 999;
          }
        }

        validatedItems.push({
          productId: product._id,
          name: product.name,
          price: price,
          image: product.images[0] || "",
          quantity: item.quantity,
          stock: stock,
          variantId: variantId ?? 0,
          variantName: variantName
        });

      } catch (err) {
        console.error(`Error validating product ${item.productId}:`, err);
        // Continue validating other products even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      data: { items: validatedItems }
    });

  } catch (error: unknown) {
    console.error("[Tiendanube API] Error validating cart:", error);
    return NextResponse.json(
      { success: false, message: "Error validating cart", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
