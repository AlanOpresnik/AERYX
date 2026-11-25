import { Product } from "@/lib/interface/ProductInterface";
import React from "react";

interface Props {
  product: Product;
}

export default function SpecsDetails({ product }: Props) {
  const specs = Object.entries(product.specs ?? {}).filter(([, v]) => v);
  if (specs.length === 0) return null;

  return (
    <section
      id="especificaciones"
      className="scroll-mt-20 px-6 py-20 md:px-[6vw] md:py-28"
    >
      {/* Dos columnas iguales: título a la izquierda, ficha a la derecha (mismo estilo que "Sin ruido") */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <h2 className="text-[clamp(2.75rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.045em]">
          Todo lo que
          <br />
          <span className="text-muted-foreground">importa.</span>
        </h2>

        <dl className="flex flex-col gap-2">
          {specs.map(([term, detail]) => (
            <div
              key={term}
              className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] items-center gap-6 rounded-xl border border-border px-4 py-4 text-sm transition-colors duration-200 hover:border-foreground/30"
            >
              <dt className="text-muted-foreground">{term}</dt>
              <dd className="font-medium">{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
