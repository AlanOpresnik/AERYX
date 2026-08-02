import { cn } from "@/lib/utils";
import React from "react";

interface Props {
    sizes: { name: string; detail: string }[];
    selectedSize: number;
    setSelectedSize: (index: number) => void;
}

export default function SizeSelection({ sizes, selectedSize, setSelectedSize }: Props) {
  return (
    <fieldset className="mt-8">
      <legend className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em]">
        Elegí tu medida
      </legend>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size, index) => (
          <button
            key={size.name}
            type="button"
            onClick={() => setSelectedSize(index)}
            aria-pressed={selectedSize === index}
            className={cn(
              "flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition-colors",
              selectedSize === index
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground",
            )}
          >
            <span className="text-sm font-semibold">{size.name}</span>
            <span
              className={cn(
                "font-mono text-[16px]",
                selectedSize === index
                  ? "text-background/80"
                  : "text-muted-foreground",
              )}
            >
              {size.detail}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
