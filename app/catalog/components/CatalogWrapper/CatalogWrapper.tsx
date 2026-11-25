import React from "react";
import { CatalogPage } from "../CatalogPage";
import { getProducts } from "@/lib/api/server-api";

export default async function CatalogWrapper() {
  const products = await getProducts();

  if (!products || products.length === 0) {
    return (
      <main className="grid min-h-[70svh] place-items-center bg-foreground px-6 pt-20 text-center text-background">
        <div>
          <p className="text-3xl tracking-[-0.04em]">No hay productos por ahora.</p>
          <p className="mt-2 text-neutral-600">Estamos cargando el catálogo. Volvé en un rato.</p>
        </div>
      </main>
    );
  }

  return <CatalogPage products={products} />;
}
