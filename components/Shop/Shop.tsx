import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pagePad } from "@/lib/products-mock-data";
import ProductCarouselWrapper from "./ProductCarouselWrapper";

function ProductCarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="min-w-0 flex-[0_0_68%] sm:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(33.333%-0.667rem)] xl:flex-[0_0_calc(25%-0.75rem)] 2xl:flex-[0_0_calc(20%-0.8rem)]"
        >
          <div className="aspect-square animate-pulse rounded-xl bg-neutral-300" />
          <div className="mt-4 flex justify-between gap-4 px-1">
            <div className="h-4 w-36 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-14 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Shop() {
  return (
    <section
      id="productos"
      className={`surface-light scroll-mt-20 bg-foreground py-24 text-background md:py-32 ${pagePad}`}
    >
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 className="text-balance text-[clamp(3rem,6vw,6rem)] leading-[.9] tracking-[-.06em]">
            Prepará tu
            <br />
            mejor partida.
          </h2>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-neutral-600">
            Superficies, accesorios y equipamiento creados para jugadores que
            buscan control, consistencia y rendimiento.
          </p>
        </div>
        <Link
          href="/catalog"
          className="group flex items-center gap-2 self-start text-[15px] font-medium md:self-auto"
        >
          Ver todos los productos
          <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-14 md:mt-20">
        <Suspense fallback={<ProductCarouselSkeleton />}>
          <ProductCarouselWrapper />
        </Suspense>
      </div>
    </section>
  );
}
