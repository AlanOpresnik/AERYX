import { mono, pagePad } from "@/lib/products-mock-data";
import { Wordmark } from "../ui/WordMark";

export function Footer() {
  return (
    <footer className="bg-foreground px-5 py-12 text-background md:px-10 md:py-16 lg:px-14">
      <div className="overflow-hidden border-b border-background/20 pb-10">
        <div className="text-[clamp(6rem,22vw,22rem)] font-semibold leading-[.7] tracking-[-.1em]">
          aery<span className="">x</span>
        </div>
      </div>
      <div className="grid gap-10 py-12 font-mono text-[10px] uppercase tracking-[0.13em] md:grid-cols-[2fr_1fr_1fr]">
        <p>
          Equipamiento gaming premium
          <br />
          para jugadores competitivos.
        </p>
        <div className="flex flex-col gap-3">
          <span className="text-background/40">Tienda</span>
          <a href="#producto">Producto</a>
          <a href="#tecnologia">Tecnología</a>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-background/40">Ayuda</span>
          <a href="mailto:hola@aeryx.gg">hola@aeryx.gg</a>
          <a href="#top">Instagram</a>
        </div>
      </div>
      <div className="flex justify-between border-t border-background/20 pt-6 font-mono text-[10px] uppercase tracking-[0.13em]">
        <span>© 2026 Aeryx</span>
        <span>Hecho para competir</span>
      </div>
    </footer>
  );
}
