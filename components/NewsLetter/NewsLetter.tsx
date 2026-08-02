'use client'
import { ArrowRight } from "lucide-react";
import { Mark } from "../ui/Mark";
import { mono, pagePad } from "@/lib/products-mock-data";

export function Newsletter() {
  return (
    <section
      className={`grid items-center gap-8 border-b border-border py-24 md:grid-cols-[auto_1fr_1fr] md:gap-12 ${pagePad}`}
    >
      <Mark className="size-12 text-muted-foreground md:size-20" />
      <div>
        <span className={mono}>Aeryx inner circle</span>
        <h2 className="mt-5 text-5xl tracking-tight md:text-7xl">
          Entrá al juego.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Recibí lanzamientos, beneficios y acceso anticipado.
        </p>
      </div>
      <form
        className="flex border-b border-foreground md:col-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="email" className="sr-only">
          Tu correo electrónico
        </label>
        <input
          id="email"
          className={`${mono} w-full bg-transparent py-5 outline-none`}
          type="email"
          placeholder="TU@EMAIL.COM"
          required
        />
        <button type="submit" aria-label="Suscribirme">
          <ArrowRight className="size-5" />
        </button>
      </form>
    </section>
  );
}
