import { mono, pagePad } from "@/lib/products-mock-data";
import { ArrowRight } from "lucide-react";

export function Categories() {
  const card =
    "group reveal flex min-h-60 flex-col justify-between border border-border bg-card p-6 transition hover:bg-foreground hover:!text-black";
  return (
    <section id="categorias" className={`py-24 md:py-32 ${pagePad}`}>
      <div
        className={`${mono} flex justify-between border-b border-border pb-5 text-muted-foreground`}
      >
        <span>Comprá por categoría</span>
        <span className="hidden sm:inline">Encontrá tu equipo</span>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-16 md:grid-cols-[1.2fr_.8fr] md:grid-rows-2">
        <a
          href="#productos"
          className={`${card} md:row-span-2 md:min-h-[37rem]`}
        >
          <span>01</span>
          <div className="relative">
            <p className={`${mono} text-muted-foreground`}>
              Control y velocidad
            </p>
            <h2 className="mt-6 text-5xl tracking-tight md:text-7xl">
              Mousepads
            </h2>
            <ArrowRight className="absolute bottom-2 right-0 size-6" />
          </div>
        </a>
        <a href="#productos" className={card}>
          <span>02</span>
          <div className="relative">
            <p className={`${mono} text-muted-foreground`}>Rendimiento</p>
            <h2 className="mt-6 text-5xl tracking-tight">Accesorios</h2>
            <ArrowRight className="absolute bottom-2 right-0 size-6" />
          </div>
        </a>
        <a href="#productos" className={card}>
          <span>03</span>
          <div className="relative">
            <p className={`${mono} text-muted-foreground`}>Todo lo esencial</p>
            <h2 className="mt-6 text-5xl tracking-tight">Combos</h2>
            <ArrowRight className="absolute bottom-2 right-0 size-6" />
          </div>
        </a>
      </div>
    </section>
  );
}
