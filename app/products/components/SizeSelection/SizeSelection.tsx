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
  const current = sizes[selectedSize];

  return (
    <fieldset>
      <legend className="mb-3 text-sm text-muted-foreground">
        Variante: <span className="font-medium text-foreground">{current?.name}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size, index) => {
          const isOutOfStock =
            size.stock !== null && size.stock !== undefined && size.stock <= 0;
          const active = selectedSize === index;

          return (
            <button
              key={size.id ?? size.name}
              type="button"
              onClick={() => !isOutOfStock && setSelectedSize(index)}
              aria-pressed={active}
              disabled={isOutOfStock}
              title={size.detail || undefined}
              className={cn(
                "relative flex h-11 min-w-16 items-center justify-center gap-2 rounded-xl border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isOutOfStock
                  ? "cursor-not-allowed border-border text-muted-foreground/50 line-through"
                  : active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground/60",
              )}
            >
              {size.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
