import { Suspense } from "react";
import { mono, pagePad, products } from "@/lib/products-mock-data";
import ProductCarousel from "./ProductCarousel";

function ProductCarouselSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-background/20" />
        <div className="h-11 w-11 animate-pulse rounded-full bg-background/20" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-full shrink-0 sm:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]"
          >
            <div className="animate-pulse rounded-2xl border border-neutral-300 bg-foreground p-2">
              <div className="h-96 rounded-xl bg-neutral-300" />
              <div className="mt-4 space-y-3 p-4">
                <div className="h-3 w-20 rounded bg-neutral-300" />
                <div className="h-4 w-36 rounded bg-neutral-300" />
                <div className="h-10 rounded-lg bg-neutral-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Shop() {
  return (
    <section
      id="productos"
      className={`bg-foreground py-24 text-background md:py-32 ${pagePad}`}
    >
      <div
        className={`${mono} flex justify-between border-b border-neutral-300 pb-5 text-neutral-500`}
      >
        <span>Productos destacados</span>
        <a href="#productos">Ver todo / 04</a>
      </div>
      <div className="reveal flex flex-col items-start gap-10 py-16 md:flex-row md:items-end md:justify-between md:py-20">
        <div>
          <span className={mono}>Elegidos por la comunidad</span>
          <h2 className="mt-6 text-balance text-[clamp(3rem,6vw,6.5rem)] leading-[.9] tracking-[-.07em]">
            Prepará tu
            <br />
            mejor partida.
          </h2>
        </div>
        <p className="max-w-md leading-relaxed text-neutral-500">
          Superficies, accesorios y equipamiento creados para jugadores que
          buscan control, consistencia y rendimiento.
        </p>
      </div>
      <div className="mt-6 overflow-visible">
        <Suspense fallback={<ProductCarouselSkeleton />}>
          <ProductCarousel products={products} />
        </Suspense>
      </div>
    </section>
  );
}
