import React from "react";
import ProductCarousel from "./ProductCarousel";
import { getProducts } from "@/lib/api/server-api";

export default async function ProductCarouselWrapper() {
  const products = await getProducts();
  
  if (!products || products.length === 0) {
    return <p>No hay productos</p>;
  }
  
  return (
    <div>
      <ProductCarousel products={products} />
    </div>
  );
}
