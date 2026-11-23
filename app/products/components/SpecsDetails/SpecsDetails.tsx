import { Product } from "@/lib/interface/ProductInterface";
import React from "react";

interface Props {
  product: Product;
}

export default function SpecsDetails({ product }: Props) {
  const specs = Object.entries(product.specs ?? {});
  if (specs.length === 0) return null;

  return (
    <section
      id="especificaciones"
      className="scroll-mt-20 px-6 py-20 md:px-[6vw] md:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Ficha técnica / 03
          </p>
          <h2 className="mt-6 text-[clamp(2.75rem,5vw,4.75rem)] font-medium leading-[0.92] tracking-[-0.055em]">
            Todo lo que <span className="text-muted-foreground">importa.</span>
          </h2>
        </div>
        <dl className="overflow-hidden rounded-2xl border border-border">
          {specs.map(([term, detail], i) => (
            <div
              key={term}
              className={`grid grid-cols-[.8fr_1.2fr] gap-6 px-5 py-5 transition-colors hover:bg-card md:px-7 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {term}
              </dt>
              <dd className="text-sm font-medium">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
