"use client";

import {
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AsideProfileProps {
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

const NAV_ITEMS = [
  {
    key: "resumen",
    label: "Resumen",
    href: "/profile",
    icon: User,
  },
  {
    key: "pedidos",
    label: "Pedidos",
    href: "/profile/pedidos",
    icon: Package,
  },
  {
    key: "datos",
    label: "Datos personales",
    href: "/profile/data",
    icon: FileText,
  },
  {
    key: "direcciones",
    label: "Direcciones",
    href: "/profile/direction",
    icon: MapPin,
  },
  {
    key: "ayuda",
    label: "Ayuda",
    href: "/help",
    icon: HelpCircle,
  },
];

export default function AsideProfile({
  firstName,
  lastName,
  createdAt,
}: AsideProfileProps) {
  const pathname = usePathname();

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;

  return (
    <aside className="w-full md:w-72 flex-shrink-0 bg-white border border-neutral-200 rounded-3xl shadow-sm p-6 flex flex-col gap-6 md:sticky md:top-8 md:self-start">
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 flex items-center justify-center text-white font-display font-semibold text-lg">
            {initials}
          </div>

          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div>
          <p className="font-semibold text-neutral-900">
            {firstName + " " + lastName}
          </p>

          <span className="inline-block mt-1 text-xs tracking-wide uppercase bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
            Miembro desde {createdAt}
          </span>
        </div>
      </div>

      <hr className="border-neutral-200" />

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
          const active =
            pathname === href ||
            (href !== "/profile" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-neutral-900 !text-white"
                  : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.7} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-700 text-sm transition-colors"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.7} />
        Cerrar sesión
      </button>
    </aside>
  );
}