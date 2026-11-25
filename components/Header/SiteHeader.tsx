"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

/** El panel de administración y las pantallas de acceso tienen su propia navegación. */
const OWN_CHROME = ["/admin", "/login", "/registro"];
export function SiteHeader() {
  const pathname = usePathname();
  if (OWN_CHROME.some((p) => pathname === p || pathname?.startsWith(`${p}/`))) return null;
  return <Header />;
}
