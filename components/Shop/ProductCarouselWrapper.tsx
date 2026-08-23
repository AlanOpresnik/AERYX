import React from "react";
import ProductCarousel from "./ProductCarousel";
import { api } from "@/lib/api/api";

export default async function ProductCarouselWrapper() {
  const products = await api.products.getAll();

  if(!products) {
    return <p>No hay productos</p>
  }

  return (
    <div>
      <ProductCarousel products={products} />
    </div>
  );
}
