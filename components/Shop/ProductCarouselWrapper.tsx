import React from "react";
import ProductCarousel from "./ProductCarousel";
import { getProducts } from "@/lib/api/server-api";

export default async function ProductCarouselWrapper() {
  const products = await getProducts();

  if (!products || products.length === 0) {
    return (
      <p className="py-16 text-neutral-600">
        Estamos cargando el catálogo. Volvé en un rato.
      </p>
    );
  }

  return <ProductCarousel products={products} />;
}
