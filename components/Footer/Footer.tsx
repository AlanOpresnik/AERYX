import Link from "next/link";
import { mono } from "@/lib/products-mock-data";

const linkClass =
  "w-fit text-[15px] text-background/70 underline-offset-4 transition-colors duration-200 hover:text-background hover:underline";

export function Footer() {
  return (
    <footer className="surface-light bg-foreground px-6 pt-16 pb-8 text-background md:px-[6vw] md:pt-20">
      <div className="grid gap-12 pb-16 md:grid-cols-[2fr_1fr_1fr]">
        <p className="max-w-xs text-pretty text-[15px] leading-relaxed text-background/70">
          Equipamiento gaming premium para jugadores competitivos.
        </p>
        <nav aria-label="Tienda" className="flex flex-col gap-3">
          <span className="text-sm font-medium">Tienda</span>
          <Link href="/catalog" className={linkClass}>
            Productos
          </Link>
          <Link href="/#categorias" className={linkClass}>
            Categorías
          </Link>
          <Link href="/#marca" className={linkClass}>
            Nosotros
          </Link>
        </nav>
        <nav aria-label="Ayuda" className="flex flex-col gap-3">
          <span className="text-sm font-medium">Ayuda</span>
          <a href="mailto:hola@aeryx.gg" className={linkClass}>
            hola@aeryx.gg
          </a>
          <Link href="/profile/pedidos" className={linkClass}>
            Mis pedidos
          </Link>
        </nav>
      </div>

      <div
        aria-hidden="true"
        className="select-none overflow-hidden pb-[0.06em] text-[clamp(6rem,24vw,24rem)] font-semibold leading-[.8] tracking-[-.07em]"
      >
        aery<span className="text-accent">x</span>
      </div>

      <div className={`${mono} mt-8 flex justify-between border-t border-background/15 pt-6 text-background/60`}>
        <span>© 2026 Aeryx</span>
        <span>Hecho para competir</span>
      </div>
    </footer>
  );
}
