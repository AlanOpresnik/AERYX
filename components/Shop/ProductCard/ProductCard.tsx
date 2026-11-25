import { Product } from "@/lib/interface/ProductInterface";
import { cn, currency } from "@/lib/utils";
import { isOutOfStock } from "@/lib/product-stock";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ViewTransition } from "react";
import { PresaleCardBadge } from "@/components/Presale/PresaleBadges";

interface Props {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: Props) {
  const price = Number(product.price) || 0;
  const original = Number(product.originalPrice) || 0;
  const hasDiscount = original > price;
  const outOfStock = isOutOfStock(product);

  return (
    <article data-product-card className={cn("group min-w-0", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="press block rounded-xl transition-transform duration-150 ease-out focus-visible:outline-offset-4"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-200">
          <ViewTransition name={`product-image-${product._id}`}>
            <Image
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              src={product.images?.[0] || "/placeholder.svg"}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, (max-width: 1536px) 25vw, 20vw"
              alt={`${product.name} de Aeryx`}
            />
          </ViewTransition>

          <div className="absolute inset-x-3 top-3 flex items-start justify-between">
            <div className="flex flex-wrap gap-1.5">
              {product.isNew && (
                <span className="rounded-full bg-[#070707] px-2.5 py-1 text-[11px] font-medium text-[#f4f4f2]">
                  Nuevo
                </span>
              )}
              {hasDiscount && (
                <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-[#070707]">
                  −{Math.round((1 - price / original) * 100)}%
                </span>
              )}
              {outOfStock && (
                <span className="rounded-full bg-[#f4f4f2] px-2.5 py-1 text-[11px] font-medium text-[#070707]">
                  Sin stock
                </span>
              )}
            </div>
            <span
              aria-hidden="true"
              className="grid size-9 translate-y-1 place-items-center rounded-full bg-[#f4f4f2] text-[#070707] opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          {!outOfStock && <PresaleCardBadge category={product.category} />}
        </div>

        <div className="flex items-start justify-between gap-3 px-0.5 pt-3">
          <div className="min-w-0">
            <ViewTransition name={`product-name-${product._id}`}>
              <h3 className="truncate text-[15px] font-medium tracking-[-0.01em]">
                {product.name}
              </h3>
            </ViewTransition>
            {product.category && (
              <p className="mt-0.5 truncate text-[13px] opacity-55">{product.category}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[15px] font-medium tabular-nums">{currency.format(price)}</p>
            {hasDiscount && (
              <p className="mt-0.5 text-[13px] tabular-nums line-through opacity-45">
                {currency.format(original)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
