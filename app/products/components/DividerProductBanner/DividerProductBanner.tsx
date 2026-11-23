import { Mark } from "@/components/ui/Mark";
import { Product } from "@/lib/interface/ProductInterface";
import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Props {
  product: Product;
}

export default function DividerProductBanner({ product }: Props) {
  const features = product.features ?? [];

  return (
    <section className="grid border-y border-border lg:grid-cols-[1.1fr_.9fr]">
      <div className="relative min-h-[30rem] overflow-hidden border-b border-border lg:min-h-[44rem] lg:border-b-0 lg:border-r">
        <Image
          src="https://res.cloudinary.com/cuqpvs4s/image/upload/v1785794404/Gemini_Generated_Image_xnqffuxnqffuxnqf_wbozvk.png"
          alt={`Setup competitivo con ${product.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-10">
          <p className="max-w-sm text-2xl font-medium leading-tight tracking-tight md:text-3xl">
            Creado para sesiones largas. Probado para competir.
          </p>
          <Mark className="size-12" />
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-20 md:px-10 lg:px-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Aeryx standard / 04
        </span>
        <h2 className="mt-6 text-[clamp(2.75rem,5vw,4.75rem)] font-medium leading-[0.92] tracking-[-0.055em]">
          Sin ruido.
          <br />
          <span className="text-muted-foreground">Solo juego.</span>
        </h2>
        {features.length > 0 && (
          <ul className="mt-12 flex flex-col gap-2">
            {features.map((item) => (
              <li
                className="flex items-center gap-4 rounded-xl border border-border px-4 py-4 text-sm transition-colors hover:border-foreground/30"
                key={item}
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-background">
                  <Check className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
