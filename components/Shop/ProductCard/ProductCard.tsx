import { Product } from "@/lib/interface/ProductInterface";
import { mono } from "@/lib/products-mock-data";
import { currency } from "@/lib/utils";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ViewTransition } from "react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <article
      data-product-card
      className="group reveal min-w-0 w-[300px] md:w-full overflow-visible rounded-2xl border border-neutral-300 bg-foreground p-2 transition duration-300 hover:-translate-y-2 hover:border-neutral-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      key={product._id}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block overflow-hidden rounded-xl"
      >
        <div className="relative  overflow-hidden rounded-xl bg-neutral-300 ">
          <ViewTransition name={`product-image-${product.slug}`}>
            <Image
              className=" object-contain bg-white transition-transform duration-700 h-80 md:h-112 xl:h-104 group-hover:scale-105"
              src={product.images[0]}
              width={500}
              height={500}
              alt={`${product.name} de Aeryx`}
            />
          </ViewTransition>
          <span
            className={`${mono} absolute left-4 top-4 rounded-full bg-background px-3 py-2 text-[.58rem] text-foreground`}
          >
            {product.tag}
          </span>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {product.isNew && (
            <span
              className={`${mono} w-fit  rounded-full text-red-400 font-bold text-[.58rem] `}
            >
              {product.isNew ? "NUEVO" : ""}
            </span>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`${mono} text-[.6rem] text-neutral-500`}>
                {product.category}
              </span>
              <ViewTransition name={`product-name-${product.slug}`}>
                <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
              </ViewTransition>
            </div>
            <strong className="whitespace-nowrap text-base">
              {currency.format(Number(product.price))}
            </strong>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Ver detalle
            <ArrowRight className="size-4" />
          </div>
        </div>
      </Link>
      <button
        className={`${mono} flex w-full !text-xs md:text-sm items-center justify-center gap-3 rounded-lg border border-background bg-background p-4 text-foreground transition hover:-translate-y-0.5 hover:bg-foreground hover:text-background`}
        aria-label={`Agregar ${product.name} al carrito`}
      >
        <ShoppingBag className="size-4" />
        Agregar al carrito
      </button>
    </article>
  );
}
