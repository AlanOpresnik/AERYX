import { currency } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { ViewTransition } from "react";

interface Props {
  product: {
    category: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    _id: string;
  };
  selectedPrice: number;
  compareAtPrice?: number | null;
}

export default function ProductRigthDetails({
  product,
  selectedPrice,
  compareAtPrice,
}: Props) {
  const hasDiscount = !!compareAtPrice && compareAtPrice > selectedPrice;
  const off = hasDiscount
    ? Math.round((1 - selectedPrice / (compareAtPrice as number)) * 100)
    : 0;
  const installment = selectedPrice / 3;

  return (
    <div className="flex flex-col">
      <nav
        aria-label="Ruta"
        className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="size-3 shrink-0 opacity-50" />
        <Link
          href="/catalog"
          className="transition-colors hover:text-foreground"
        >
          Catálogo
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-3 shrink-0 opacity-50" />
            <span className="truncate text-foreground">{product.category}</span>
          </>
        )}
      </nav>

      <ViewTransition name={`product-name-${product._id}`}>
        <h1 className="mt-8 text-balance text-[clamp(2.5rem,4.6vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.04em]">
          {product.name}
        </h1>
      </ViewTransition>

      {product.description && (
        <p className="mt-5 max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground line-clamp-4">
          {product.description}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <strong className="text-[2.5rem] font-medium leading-none tabular-nums tracking-[-0.04em]">
          {currency.format(selectedPrice)}
        </strong>
        {hasDiscount && (
          <>
            <span className="text-base text-muted-foreground line-through tabular-nums">
              {currency.format(compareAtPrice as number)}
            </span>
            <span className="text-sm font-medium text-red-400">−{off}%</span>
          </>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {installment >= 1000 ? (
          <>
            o 3 cuotas de{" "}
            <span className="text-foreground tabular-nums">{currency.format(installment)}</span>
          </>
        ) : (
          "Precio final, impuestos incluidos"
        )}
      </p>
    </div>
  );
}
