import { mono, pagePad } from "@/lib/products-mock-data";
import { ShoppingBag } from "lucide-react";
import { Mark } from "../ui/Mark";
import Link from "next/link";

export function Header() {
  return (
    <header
      className={`absolute inset-x-0 top-0 !z-50 flex h-20 items-center justify-between border-b border-border !bg-black ${pagePad}`}
    >
      <Link
        href="/"
        className={`${mono} flex items-center gap-3 text-foreground text-2xl font-semibold tracking-[-.02em]`}
        aria-label="Inicio de Aeryx "
      >
        <h1 className="text-2xl font-semibold ">AERYX</h1>
      </Link>
      <nav
        className={`${mono} hidden gap-10 text-muted-foreground md:flex`}
        aria-label="Navegación principal"
      >
        <Link className="hover:text-foreground" href="/products">
          Productos
        </Link>
        <Link className="hover:text-foreground" href="/categories">
          Categorías
        </Link>
        <Link className="hover:text-foreground" href="/about">
          Nosotros
        </Link>
      </nav>
      <Link href="/products" className={`${mono} flex items-center gap-2`}>
        <ShoppingBag className="size-4" />
        <span className="hidden sm:inline">Tienda</span>
        <span className="grid size-6 place-items-center rounded-full bg-foreground text-background">
          0
        </span>
      </Link>
    </header>
  );
}
