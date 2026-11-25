"use client";

import { Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { useAnnouncements } from "@/components/Announcement/AnnouncementsContext";
import { cartPromo, daysLeft } from "@/lib/announcement-utils";
import type { CheckoutItem } from "@/lib/interface/cart";
import { cn } from "@/lib/utils";

/**
 * Aviso de promo con regalo dentro del carrito.
 * Si el pedido califica, lo confirma. Si no, recuerda cómo conseguirlo.
 */
export function CartPromo({ items }: { items: CheckoutItem[] }) {
  const announcements = useAnnouncements();
  // La hora se toma en el navegador para respetar las fechas aunque la página esté cacheada
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  if (now === null) return null;

  const promo = cartPromo(
    announcements,
    items.map((i) => i.category ?? "").filter(Boolean),
    now,
  );
  if (!promo) return null;

  const { announcement, qualifies } = promo;
  const left = daysLeft(announcement, now);
  const until =
    announcement.endsOn &&
    new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "numeric", timeZone: "UTC" }).format(
      new Date(`${announcement.endsOn}T12:00:00Z`),
    );

  return (
    <div
      role="status"
      className={cn(
        "cart-promo mb-5 flex gap-3 rounded-2xl border p-3.5 text-sm",
        qualifies ? "border-accent/40 bg-accent/10" : "border-border",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-full",
          qualifies ? "bg-accent text-[#070707]" : "bg-foreground/[0.06] text-muted-foreground",
        )}
      >
        <Gift className="size-4" />
      </span>
      <div className="min-w-0">
        <p className={cn("leading-snug", qualifies ? "font-medium" : "text-muted-foreground")}>
          {qualifies ? announcement.cartNote : announcement.message}
        </p>
        {until && (
          <p className="mt-1 text-xs text-muted-foreground">
            {qualifies ? "Promo válida" : "Válido"} hasta el {until}
            {left !== null && left <= 3 ? ` · ${left === 0 ? "último día" : `quedan ${left} días`}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
