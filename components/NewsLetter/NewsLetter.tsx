'use client'
import { ArrowRight } from "lucide-react";
import { Mark } from "../ui/Mark";
import { pagePad } from "@/lib/products-mock-data";

export function Newsletter() {
  return (
    <section
      className={`grid items-end gap-10 border-t border-border py-24 md:grid-cols-[auto_1fr_minmax(18rem,26rem)] md:gap-14 md:py-32 ${pagePad}`}
    >
      <Mark className="size-12 text-muted-foreground md:size-16 md:self-center" />
      <div>
        <h2 className="text-[clamp(2.75rem,5vw,4.5rem)] leading-[.92] tracking-[-.05em]">
          Entrá al juego.
        </h2>
        <p className="mt-4 max-w-sm text-pretty text-muted-foreground">
          Recibí lanzamientos, beneficios y acceso anticipado.
        </p>
      </div>
      <form
        className="group flex items-center rounded-full border border-border bg-card pl-5 pr-1.5 transition-colors duration-200 focus-within:border-foreground/60"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Tu correo electrónico
        </label>
        <input
          id="newsletter-email"
          className="h-14 w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          required
        />
        <button
          type="submit"
          aria-label="Suscribirme"
          className="press grid size-11 shrink-0 place-items-center rounded-full bg-foreground text-background transition-[background-color,transform] duration-200 ease-out hover:bg-white"
        >
          <ArrowRight className="size-4" />
        </button>
      </form>
    </section>
  );
}
