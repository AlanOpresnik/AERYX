"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/profile", label: "Resumen", exact: true },
  { href: "/profile/pedidos", label: "Pedidos" },
  { href: "/profile/datos", label: "Mis datos" },
  { href: "/profile/seguridad", label: "Seguridad" },
];

export function ProfileNav({ ongoing }: { ongoing: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Mi cuenta" className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0">
      <ul className="flex w-max gap-1 rounded-full border border-border p-1">
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname?.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press flex h-9 items-center gap-2 rounded-full px-4 text-sm transition-[background-color,color,transform] duration-150",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {tab.label === "Pedidos" && ongoing > 0 && (
                  <span
                    aria-label={`${ongoing} en curso`}
                    className={cn(
                      "grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold leading-5 tabular-nums",
                      active ? "bg-background text-foreground" : "bg-accent text-background",
                    )}
                  >
                    {ongoing}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
