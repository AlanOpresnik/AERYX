import { currency } from "@/lib/utils";
import React from "react";

interface Props {
    product: {
        category: string;
        slug: string;
        name: string;
        description: string;
        price: number;
    },
    selectedPrice: number;
}

export default function ProductRigthDetails({ product, selectedPrice }: Props) {
  return (
    <>
      <div className="flex items-center justify-between font-mono text-[14px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>{product.category}</span>
        <span>{product.slug}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center py-12 lg:py-8">
        <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.18em]">
          Precision surface
        </p>
        <h1 className="max-w-xl text-balance text-6xl font-semibold leading-[0.86] tracking-[-0.065em] sm:text-7xl xl:text-[7rem]">
          {product.name}
        </h1>
        <p className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-10 flex items-end justify-between border-b border-border pb-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Precio final
          </span>
          <strong className="text-3xl tracking-tight">
            {currency.format(selectedPrice)}
          </strong>
        </div>
      </div>
    </>
  );
}
