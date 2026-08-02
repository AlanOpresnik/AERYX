import { Mark } from "@/components/ui/Mark";
import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function DividerProductBanner() {
  return (
    <section className="grid border-y border-border lg:grid-cols-[1.1fr_.9fr]">
      <div className="relative min-h-[34rem] border-b border-border lg:min-h-[46rem] lg:border-b-0 lg:border-r">
        <Image
          src="/aeryx-pad-desk.png"
          alt="Setup competitivo con Control 01"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-foreground/85 p-5 text-background backdrop-blur-sm md:p-8">
          <p className="max-w-sm text-2xl font-semibold leading-tight tracking-tight">
            Creado para sesiones largas. Probado para competir.
          </p>
          <Mark className="size-12" />
        </div>
      </div>
      <div className="flex flex-col justify-center px-5 py-20 md:px-10 lg:px-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Aeryx standard / 04
        </span>
        <h2 className="mt-6 text-5xl font-semibold leading-[0.9] tracking-[-0.055em] md:text-7xl">
          Sin ruido.
          <br />
          Solo juego.
        </h2>
        <ul className="mt-12 flex flex-col border-t border-border">
          {[
            "Diseño probado en juego",
            "Materiales de alto rendimiento",
            "Dos años de garantía",
          ].map((item) => (
            <li
              className="flex items-center gap-3 border-b border-border py-5 text-sm"
              key={item}
            >
              <Check className="size-4" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
