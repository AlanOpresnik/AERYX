import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import HeroTitle from "../Hero/HeroTitle";

const brandImage =
  "https://res.cloudinary.com/cuqpvs4s/image/upload/v1795300253/7734f318-2caf-4b49-a94d-2e10dcbff832_medc0e.jpg";

const points = [
  "Diseño probado en juego",
  "Materiales de alto rendimiento",
  "Desarrollado para competir",
];

export function Brand() {
  return (
    <section
      id="marca"
      className="surface-light grid scroll-mt-20 bg-foreground text-background lg:grid-cols-[1.05fr_.95fr]"
    >
      <div className="min-h-[26rem] overflow-hidden lg:min-h-[44rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="size-full object-cover"
          src={brandImage}
          alt="Setup gamer con equipamiento Aeryx"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-start justify-center px-6 py-20 md:px-12 lg:px-[6vw]">
        <h2 className="text-[clamp(3rem,5.5vw,6rem)] leading-[.9] tracking-[-.06em]">
          Nacimos para
          <br />
          <HeroTitle words={["competir", "ganar"]} />
        </h2>
        <p className="mt-8 max-w-md text-pretty leading-relaxed text-neutral-600">
          Diseñamos equipamiento moderno, preciso y funcional. Cada producto
          Aeryx combina tecnología, comodidad y una estética que no necesita
          exagerar.
        </p>
        <ul className="mt-8 flex flex-col gap-3">
          {points.map((x) => (
            <li className="flex items-center gap-3 text-[15px]" key={x}>
              <span className="grid size-5 place-items-center rounded-full bg-background text-foreground">
                <Check className="size-3" />
              </span>
              {x}
            </li>
          ))}
        </ul>
        <Link
          href="/catalog"
          className="press group mt-12 flex h-14 items-center gap-4 rounded-full bg-background pl-6 pr-2 text-[15px] font-medium text-foreground transition-[background-color,transform] duration-200 ease-out hover:bg-[#1a1a1a]"
        >
          Conocer los productos
          <span className="grid size-10 place-items-center rounded-full bg-foreground text-background transition-transform duration-300 ease-out group-hover:translate-x-0.5">
            <ArrowRight className="size-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
