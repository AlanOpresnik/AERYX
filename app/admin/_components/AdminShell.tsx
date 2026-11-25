"use client";

import { SignOutButton } from "@clerk/nextjs";
import {
  ArrowUpRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Gift,
  Megaphone,
  Menu,
  Package,
  Store,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/preventa", label: "Preventa", icon: Gift },
  { href: "/admin/anuncios", label: "Anuncios", icon: Megaphone },
];

interface Props {
  children: React.ReactNode;
  name: string;
  email: string;
  storeAdmin: string | null;
  toShip: number;
}

function NavContent({ name, email, storeAdmin, toShip, onNavigate }: Omit<Props, "children"> & { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="flex h-16 items-center gap-2 px-5">
        <span className="text-lg font-medium tracking-[-0.04em]">
          aery<span className="text-accent">x</span>
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          Admin
        </span>
      </Link>

      <nav aria-label="Panel" className="flex flex-1 flex-col gap-0.5 px-3 pt-4">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150",
                active
                  ? "bg-foreground/[0.07] text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
              {label === "Pedidos" && toShip > 0 && (
                <span
                  className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold leading-none text-background tabular-nums"
                  aria-label={`${toShip} por enviar`}
                >
                  {toShip}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-4 h-px bg-border" />

        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.04] hover:text-foreground"
        >
          <Store className="size-4" />
          Ver la tienda
        </Link>
        {storeAdmin && (
          <a
            href={storeAdmin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.04] hover:text-foreground"
          >
            <ArrowUpRight className="size-4" />
            Abrir Tiendanube
          </a>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground/10 text-xs font-medium uppercase"
          >
            {(name || email).slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{name || "Superadmin"}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <SignOutButton redirectUrl="/">
            <button
              type="button"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="press grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-foreground/[0.06] hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children, ...nav }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border lg:block">
        <NavContent {...nav} />
      </aside>

      {/* Barra móvil */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 lg:hidden">
        <span className="text-base font-medium tracking-[-0.04em]">
          aery<span className="text-accent">x</span>{" "}
          <span className="text-sm text-muted-foreground">admin</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="press grid size-9 place-items-center rounded-lg hover:bg-foreground/[0.06]"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label="Menú"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background transition-[transform,visibility] duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="press absolute right-3 top-3.5 grid size-9 place-items-center rounded-lg hover:bg-foreground/[0.06]"
        >
          <X className="size-5" />
        </button>
        <NavContent {...nav} onNavigate={() => setOpen(false)} />
      </aside>

      <main className="lg:pl-60">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}
