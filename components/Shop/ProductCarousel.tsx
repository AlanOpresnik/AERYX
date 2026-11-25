"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard/ProductCard";
import { Product } from "@/lib/interface/ProductInterface";

interface ProductCarouselProps {
  products: Product[];
}

const arrowClass =
  "press grid size-11 place-items-center rounded-full border border-background/15 text-background transition-[background-color,color,opacity,transform] duration-200 ease-out hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-30";

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update).on("reInit", update).on("scroll", update);
    return () => {
      emblaApi.off("select", update).off("reInit", update).off("scroll", update);
    };
  }, [emblaApi, update]);

  const scrollable = canPrev || canNext;

  return (
    <div>
      <div className="-mx-1 overflow-hidden px-1" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">
          {products.map((product) => (
            <div
              key={product.slug}
              className="min-w-0 flex-[0_0_68%] sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(33.333%-0.667rem)] xl:flex-[0_0_calc(25%-0.75rem)] 2xl:flex-[0_0_calc(20%-0.8rem)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {scrollable && (
        <div className="mt-10 flex items-center gap-6">
          {/* Barra de progreso del carrusel */}
          <div className="relative h-px flex-1 bg-background/15" aria-hidden="true">
            <div
              className="absolute inset-y-0 left-0 bg-background"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className={arrowClass}
              aria-label="Ver productos anteriores"
              disabled={!canPrev}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className={arrowClass}
              aria-label="Ver productos siguientes"
              disabled={!canNext}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
