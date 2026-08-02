import { mono } from "@/lib/products-mock-data";
import { ArrowRight, Check } from "lucide-react";
import HeroTitle from "../Hero/HeroTitle";
export function Brand() {
  
  const brandImage =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aeryx%20logo-05.jpg-aavJjNEt41m3jnxRsGlXIfkjD3t8ds.jpeg";
  return (
    <section
      id="marca"
      className="grid min-h-[48rem] bg-foreground text-background lg:grid-cols-[1.05fr_.95fr]"
    >
      <div className="min-h-104 overflow-hidden lg:min-h-[40rem]">
        <img
          className="size-full object-cover object-[50%_28%] grayscale"
          src={brandImage}
          alt="Sistema de identidad visual Aeryx"
        />
      </div>
      <div className="reveal flex flex-col items-start justify-center px-8 py-20 lg:px-[7vw]">
        <span className={mono}>Nuestra filosofía</span>
        <h2 className="my-6 text-[clamp(3rem,6vw,6.5rem)] leading-[.9] tracking-[-.07em]">
          Nacimos para
          <br />
          <HeroTitle words={["competir", "ganar"]} /> 
        </h2>
        <p className="max-w-xl leading-relaxed text-neutral-500">
          Diseñamos equipamiento moderno, preciso y funcional. Cada producto
          Aeryx combina tecnología, comodidad y una estética que no necesita
          exagerar.
        </p>
        <ul className="my-8 flex list-none flex-col gap-4 p-0">
          {[
            "Diseño probado en juego",
            "Materiales de alto rendimiento",
            "Desarrollado para competir",
          ].map((x) => (
            <li className="flex items-center gap-3 text-sm" key={x}>
              <Check className="size-4" />
              {x}
            </li>
          ))}
        </ul>
        <a
          href="#productos"
          className={`${mono} flex items-center gap-6 rounded-full bg-background px-5 py-4 text-foreground`}
        >
          Conocer Aeryx <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
