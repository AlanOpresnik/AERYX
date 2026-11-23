import { Product } from "@/lib/interface/ProductInterface";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { ViewTransition } from "react";

interface Props {
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  product: Product;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function ImagesProductDetails({
  product,
  selectedImage,
  setSelectedImage,
}: Props) {
  const images = product.images?.length ? product.images : ["/placeholder.svg"];
  const total = images.length;
  const current = images[selectedImage] ?? images[0];

  const go = (dir: 1 | -1) =>
    setSelectedImage((selectedImage + dir + total) % total);

  return (
    <div className="flex flex-col gap-3 px-4 pt-4 md:px-6 md:pt-6 lg:sticky lg:top-20 lg:h-[calc(100svh-5rem)] lg:py-6 lg:pl-[6vw] lg:pr-0">
      <div className="group relative flex-1 overflow-hidden rounded-2xl bg-[#f4f4f2] ring-1 ring-white/5">
        {/* Halo suave para dar profundidad sin romper el fondo claro del producto */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#f4f4f2_55%,#e7e7e3_100%)]"
        />

        <div className="relative aspect-square lg:aspect-auto lg:h-full">
          <ViewTransition name={`product-image-${product._id}`}>
            <Image
              key={current}
              src={current}
              alt={`${product.name} — imagen ${selectedImage + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="animate-in fade-in object-contain p-6 mix-blend-multiply duration-500 md:p-12"
            />
          </ViewTransition>
        </div>

        <div className="absolute inset-x-4 top-4 flex items-start justify-between md:inset-x-5 md:top-5">
          <span className="rounded-full bg-[#070707] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f4f4f2]">
            {product.isNew ? "Nuevo drop" : product.tag || "Aeryx / 01"}
          </span>
          {product.inDiscount && (
            <span className="rounded-full bg-red-400 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#070707]">
              Oferta
            </span>
          )}
        </div>

        {total > 1 && (
          <>
            <div className="absolute inset-y-0 left-3 flex items-center opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Imagen anterior"
                className="grid size-10 place-items-center rounded-full bg-[#070707]/80 text-[#f4f4f2] backdrop-blur transition-transform hover:scale-105"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Imagen siguiente"
                className="grid size-10 place-items-center rounded-full bg-[#070707]/80 text-[#f4f4f2] backdrop-blur transition-transform hover:scale-105"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </>
        )}

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#070707]/60 md:inset-x-5 md:bottom-5">
          <span>{product.category}</span>
          <span className="tabular-nums text-[#070707]">
            {pad(selectedImage + 1)} <span className="text-[#070707]/40">/ {pad(total)}</span>
          </span>
        </div>
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {images.map((image, index) => {
            const active = selectedImage === index;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={active}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f4f4f2] transition-all md:size-20",
                  active
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "opacity-50 hover:opacity-90",
                )}
              >
                <Image
                  src={image}
                  fill
                  sizes="80px"
                  alt=""
                  className="object-contain p-1.5 mix-blend-multiply"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
