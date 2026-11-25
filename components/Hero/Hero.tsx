import Image from "next/image";
import Link from "next/link";
import { mono, pagePad } from "@/lib/products-mock-data";
import { ArrowRight } from "lucide-react";
import { Mark } from "../ui/Mark";
import HeroTitle from "./HeroTitle";

export function Hero() {
  return (
    <section
      id="inicio"
      className={`relative isolate flex min-h-[max(44rem,100svh)] flex-col justify-center overflow-hidden pt-32 pb-28 ${pagePad}`}
    >
      {/* Fondo */}
      <div className="smoke smoke-one" />
      <div className="smoke smoke-two" />
      <div className="hero-grid" aria-hidden="true" />

      {/* Contenido: la única entrada animada del sitio */}
      <div className="hero-enter relative z-10 w-full max-w-4xl">
        <h1 className="flex flex-col text-balance text-[clamp(4rem,9.5vw,9rem)] font-normal leading-[.84] tracking-[-.065em]">
          <span>Jugá con</span>
          <strong className="font-normal">
            <HeroTitle words={["calidad", "precisión", "Aeryx"]} />
          </strong>
        </h1>

        <p className="mt-10 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Equipamiento diseñado para transformar cada movimiento en una ventaja
          competitiva.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link
            href="/catalog"
            className="press group flex h-14 items-center gap-4 rounded-full bg-foreground pl-6 pr-2 text-[15px] font-medium text-background transition-[background-color,transform] duration-200 ease-out hover:bg-white"
          >
            Ver productos
            <span className="grid size-10 place-items-center rounded-full bg-background text-foreground transition-transform duration-300 ease-out group-hover:translate-x-0.5">
              <ArrowRight className="size-4" />
            </span>
          </Link>

          <a
            href="#categorias"
            className="group flex items-center gap-2 text-[15px] text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Explorar categorías
            <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Banner derecho */}
      <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
        <Image
          src="/banner/Banner3.png"
          alt=""
          width={600}
          height={1220}
          priority
          sizes="(max-width: 1280px) 500px, (max-width: 1536px) 800px, 870px"
          className="h-auto w-[500px] xl:w-[800px] 2xl:w-[870px]"
        />
      </div>

      <Mark className="absolute right-[10vw] top-1/2 -z-10 hidden size-[18vw] -translate-y-1/2 text-border lg:block" />

      {/* Pie del hero */}
      <div
        className={`${mono} absolute inset-x-6 bottom-8 z-10 flex justify-between text-background/70 md:inset-x-[6vw]`}
      >
        <span>Aeryx — Born to compete</span>
        <span className="hidden sm:inline">Envíos a todo el país</span>
      </div>

      {/* Fundido hacia la barra de beneficios */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-background/80 to-foreground" />
    </section>
  );
}
