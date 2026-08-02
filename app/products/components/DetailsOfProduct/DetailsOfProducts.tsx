import Image from "next/image";
import React from "react";

export default function DetailsOfProducts() {
  return (
    <section
      id="tecnologia"
      className="grid bg-foreground text-background lg:grid-cols-2"
    >
      <div className="relative min-h-[32rem] lg:min-h-[48rem]">
        <Image
          src="https://down-br.img.susercontent.com/file/br-11134207-81z1k-mhkoehlpvaiu8a"
          alt="Textura de precisión del Control 01"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover "
        />
      </div>
      <div className="flex flex-col justify-between px-5 py-16 md:px-10 lg:px-16 lg:py-20">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-background/50">
          <span>Ingeniería de superficie</span>
          <span>02 / 04</span>
        </div>
        <div className="py-20">
          <h2 className="text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.055em] md:text-7xl">
            Control que se siente. Velocidad que responde.
          </h2>
          <p className="mt-8 max-w-lg text-pretty leading-relaxed text-background/60">
            El tejido microtexturizado mantiene una fricción inicial baja y una
            frenada consistente. Cada pasada conserva la misma respuesta, desde
            el centro hasta los bordes.
          </p>
        </div>
        <div className="grid grid-cols-2 border-t border-background/20 pt-6 font-mono text-[10px] uppercase tracking-[0.12em]">
          <span>Micro weave</span>
          <span>Heat treated</span>
        </div>
      </div>
    </section>
  );
}
