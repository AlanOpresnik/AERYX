import { Product } from "@/lib/interface/ProductInterface";
import Image from "next/image";
import React from "react";

interface Props {
  product: Product;
}

export default function DetailsOfProducts({ product }: Props) {
  const tags = product.descriptionSetUp?.length
    ? product.descriptionSetUp.slice(0, 4)
    : ["Micro weave", "Heat treated"];

  return (
    <section
      id="tecnologia"
      className="grid scroll-mt-20 bg-foreground text-background lg:grid-cols-2"
    >
      <div className="relative min-h-[28rem] overflow-hidden lg:min-h-[44rem]">
        {product.publicity_image ? (
          <Image
            src={product.publicity_image}
            alt={`Detalle de ${product.name}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1.5s] hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2b2b2b,#070707)]" />
        )}
      </div>
      <div className="flex flex-col justify-between px-6 py-16 md:px-10 lg:px-16 lg:py-20">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-background/50">
          <span>Ingeniería de superficie</span>
          <span>02 / 04</span>
        </div>
        <div className="py-16">
          <h2 className="text-balance text-[clamp(2.75rem,5vw,4.75rem)] font-medium leading-[0.92] tracking-[-0.055em]">
            Control que se siente.{" "}
            <span className="text-background/40">Velocidad que responde.</span>
          </h2>
          <p className="mt-8 max-w-lg text-pretty leading-relaxed text-background/60">
            El tejido microtexturizado mantiene una fricción inicial baja y una
            frenada consistente. Cada pasada conserva la misma respuesta, desde
            el centro hasta los bordes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-background/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-background/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
