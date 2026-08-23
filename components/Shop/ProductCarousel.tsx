"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard/ProductCard";
import { Product } from "@/lib/interface/ProductInterface";

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-background/20 bg-background text-foreground transition hover:-translate-y-0.5 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Ver productos anteriores"
          disabled={!emblaApi?.canScrollPrev()}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-background/20 bg-background text-foreground transition hover:-translate-y-0.5 hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Ver productos siguientes"
          disabled={!emblaApi?.canScrollNext()}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="pt-6 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={product.slug}
              className="min-w-[85%] shrink-0 sm:min-w-[calc(50%-0.5rem)] xl:min-w-[calc(25%-0.75rem)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2.5 w-2.5 rounded-full transition ${index === selectedIndex ? "bg-background" : "bg-background/30"}`}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
