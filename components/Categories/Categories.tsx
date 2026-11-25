import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Mark } from "../ui/Mark";
import { pagePad } from "@/lib/products-mock-data";

const categories = [
  {
    name: "Mousepads",
    text: "Superficies de control y velocidad para cada estilo de juego.",
    featured: true,
  },
  { name: "Accesorios", text: "Los detalles que suman rendimiento." },
  { name: "Combos", text: "Todo lo esencial, en un solo paso." },
];

export function Categories() {
  return (
    <section id="categorias" className={`scroll-mt-20 py-24 md:py-32 ${pagePad}`}>
      <h2 className="max-w-2xl text-balance text-[clamp(2.75rem,5vw,5rem)] leading-[.92] tracking-[-.055em]">
        Comprá por categoría.
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-3 md:mt-20 md:grid-cols-[1.25fr_.75fr] md:grid-rows-2">
        {categories.map(({ name, text, featured }) => (
          <Link
            key={name}
            href="/catalog"
            className={`press group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[background-color,border-color,transform] duration-300 ease-out hover:border-foreground/25 hover:bg-[#161616] md:p-8 ${
              featured ? "md:row-span-2 md:min-h-[34rem]" : ""
            }`}
          >
            {featured && (
              <Mark className="absolute -right-10 -top-10 size-72 text-white/[0.04] transition-transform duration-700 ease-out group-hover:rotate-12" />
            )}
            <span
              aria-hidden="true"
              className="absolute right-6 top-6 grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-[background-color,color,border-color] duration-300 ease-out group-hover:border-foreground group-hover:bg-foreground group-hover:text-background md:right-8 md:top-8"
            >
              <ArrowUpRight className="size-4" />
            </span>
            <h3
              className={`tracking-[-0.045em] ${
                featured ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
              }`}
            >
              {name}
            </h3>
            <p className="mt-3 max-w-xs text-pretty text-muted-foreground">{text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
