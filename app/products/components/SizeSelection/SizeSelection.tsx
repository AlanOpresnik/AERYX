import { cn } from "@/lib/utils";
import React from "react";

interface SizeOption {
  id: number;
  name: string;
  detail: string;
  price?: number;
  stock?: number | null;
}

interface Props {
  sizes: SizeOption[];
  selectedSize: number;
  setSelectedSize: (index: number) => void;
}

export default function SizeSelection({ sizes, selectedSize, setSelectedSize }: Props) {
  return (
    <fieldset className="mt-2">
      <legend className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em]">
        Elegí tu medida
      </legend>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size, index) => {
          const isOutOfStock = size.stock !== null && size.stock !== undefined && size.stock <= 0;

          return (
            <button
              key={size.id ?? size.name}
              type="button"
              onClick={() => !isOutOfStock && setSelectedSize(index)}
              aria-pressed={selectedSize === index}
              disabled={isOutOfStock}
              className={cn(
                "flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition-colors",
                isOutOfStock
                  ? "cursor-not-allowed border-border opacity-40"
                  : selectedSize === index
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold">{size.name}</span>
                {!isOutOfStock && size.stock !== null && size.stock !== undefined && (
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                )}
                {isOutOfStock && (
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                )}
              </div>
              <span
                className={cn(
                  "font-mono text-[16px]",
                  selectedSize === index && !isOutOfStock
                    ? "text-background/80"
                    : "text-muted-foreground",
                )}
              >
                {isOutOfStock ? "Sin stock" : size.detail}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
