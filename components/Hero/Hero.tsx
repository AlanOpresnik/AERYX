import Image from "next/image";
import { mono, pagePad } from "@/lib/products-mock-data";
import { Header } from "../Header/Header";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Mark } from "../ui/Mark";
import HeroTitle from "./HeroTitle";

export function Hero() {
  return (
    <section
      id="inicio"
      className={`relative isolate flex min-h-[48rem] h-svh flex-col justify-center overflow-hidden pt-28 pb-12 ${pagePad}`}
    >
      {/* Efectos de fondo */}
      <div className="smoke smoke-one" />
      <div className="smoke smoke-two" />
      <div className="hero-grid" aria-hidden="true" />

      <Header />

      {/* Contenido */}
      <div className="reveal relative z-10 w-full max-w-5xl">
        <span
          className={`${mono} flex justify-between gap-2 text-muted-foreground sm:justify-start sm:gap-8`}
        >
          <span>Equipamiento gaming premium</span>
          <span>Colección 01</span>
        </span>

        <h1 className="my-10 flex flex-col text-balance text-[clamp(4.25rem,10vw,10rem)] font-normal leading-[.82] tracking-[-.08em]">
          <span>Jugá con</span>
          <strong className="font-normal text-muted-foreground">
            <HeroTitle words={["calidad", "precisión", "Aeryx"]} />
          </strong>
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-xl">
          Equipamiento diseñado para transformar cada movimiento en una ventaja
          competitiva.
        </p>

        <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <a
            href="#productos"
            className={`${mono} flex items-center gap-6 rounded-full border border-foreground bg-foreground px-5 py-4 !text-black transition-transform hover:-translate-y-1`}
          >
            Comprar ahora <ArrowDown className="size-4" />
          </a>

          <a
            href="#categorias"
            className={`${mono} flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground`}
          >
            Ver categorías <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      {/* Banner derecho */}
      <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
        <Image
          src="/banner/Banner.png"
          alt="Banner de Aeryx"
          width={1000}
          height={1220}
          priority
          sizes="(1024px) 30vw, (1280px) 35vw, 40vw"
          className="
      h-auto
      w-[700px]
      xl:w-[800px]
      2xl:w-[1000px]
    "
        />
      </div>

      <Mark className="absolute right-[10vw] top-1/2 hidden size-[18vw] -translate-y-1/2 text-border lg:block" />

      {/* Footer */}
      <div
        className={`${mono} absolute inset-x-6 bottom-8 z-10 flex justify-between text-black md:inset-x-[6vw]`}
      >
        <span>Aeryx — Born to compete</span>
        <span className="hidden sm:inline">Envíos a todo el país</span>
      </div>

      {/* Gradiente inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-black to-[#F4F4F2]" />
    </section>
  );
}
