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
    <div className="flex flex-col gap-3 px-4 pt-4 md:px-6 md:pt-6 lg:h-[calc(100svh-5rem)] lg:max-h-[52rem] lg:py-6 lg:pl-[6vw] lg:pr-0">
      <div className="group relative flex-1 overflow-hidden rounded-2xl bg-card ring-1 ring-border">
        <div className="relative aspect-square lg:aspect-auto lg:h-full">
          <ViewTransition name={`product-image-${product._id}`}>
            <Image
              key={current}
              src={current}
              alt={`${product.name} — imagen ${selectedImage + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="animate-in fade-in object-cover duration-500"
            />
          </ViewTransition>
        </div>

        <div className="absolute inset-x-4 top-4 flex items-start justify-between md:inset-x-5 md:top-5">
          <span className="rounded-full bg-[#070707]/80 backdrop-blur px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f4f4f2]">
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
                className="grid size-10 place-items-center rounded-full bg-[#070707]/80 text-[#f4f4f2] backdrop-blur transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.97]"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Imagen siguiente"
                className="grid size-10 place-items-center rounded-full bg-[#070707]/80 text-[#f4f4f2] backdrop-blur transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.97]"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </>
        )}

        <span className="absolute bottom-4 right-4 rounded-full bg-[#070707]/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-[#f4f4f2] backdrop-blur md:bottom-5 md:right-5">
          {pad(selectedImage + 1)} <span className="text-[#f4f4f2]/50">/ {pad(total)}</span>
        </span>
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
                  "press relative size-16 shrink-0 overflow-hidden rounded-xl bg-card transition-[opacity,transform,box-shadow] duration-200 ease-out md:size-20",
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
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
