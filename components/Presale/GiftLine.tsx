"use client";

import { Gift } from "lucide-react";
import { useEffect, useState } from "react";
import type { CheckoutItem } from "@/lib/interface/cart";
import type { GiftInfo } from "@/lib/presale";
import { cn, currency } from "@/lib/utils";

/** Pide al servidor qué regalo de preventa le toca a este carrito. */
export function useCartGift(items: Pick<CheckoutItem, "variantId" | "quantity">[]): GiftInfo | null {
  const [gift, setGift] = useState<GiftInfo | null>(null);
  const key = items.map((i) => `${i.variantId}:${i.quantity}`).join(",");

  useEffect(() => {
    if (!key) return setGift(null);
    const controller = new AbortController();
    fetch("/api/presale/gift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })) }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setGift(data?.gift ?? null))
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return gift;
}

const shortDate = (d: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

/**
 * El regalo como un producto más del pedido: foto, nombre, precio tachado y "Regalo".
 * `tone` adapta los colores al carrito (oscuro) o al checkout (claro).
 */
export function GiftLine({ gift, tone = "dark" }: { gift: GiftInfo; tone?: "dark" | "light" }) {
  const light = tone === "light";

  if (gift.quantity === 0) {
    return (
      <p className={cn("rounded-2xl border p-3.5 text-sm", light ? "border-black/15 text-black/60" : "border-border text-muted-foreground")}>
        Se agotaron las mangas de regalo de la preventa. Tu pedido sigue con el precio de preventa.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "gift-line flex gap-4 rounded-2xl border p-3",
        light ? "border-[#f87171]/50 bg-[#f87171]/10" : "border-accent/40 bg-accent/10",
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-900">
        {gift.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gift.image} alt="" className="size-full object-cover" />
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-1 right-1 grid size-6 place-items-center rounded-full bg-[#f87171] text-[#070707]"
        >
          <Gift className="size-3.5" />
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        <div>
          <p className="text-sm font-medium">
            {gift.name}
            {gift.quantity > 1 && <span className="tabular-nums"> × {gift.quantity}</span>}
          </p>
          <p className={cn("mt-0.5 text-xs", light ? "text-black/60" : "text-muted-foreground")}>
            Regalo de preventa por tu mousepad
            {gift.quantity > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-end justify-between gap-2">
          <p className={cn("text-xs", light ? "text-black/55" : "text-muted-foreground")}>
            {gift.shipsFrom ? `Despacho desde el ${shortDate(gift.shipsFrom)}` : `Válido hasta el ${shortDate(gift.endsOn)}`}
            {gift.remaining !== null && gift.remaining <= 20 && ` · Quedan ${gift.remaining}`}
          </p>
          <p className="shrink-0 text-right text-sm tabular-nums">
            <span className={cn("mr-2 line-through", light ? "text-black/45" : "text-muted-foreground")}>
              {currency.format(gift.value * gift.quantity)}
            </span>
            <span className="font-semibold">Regalo</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/** "Ahorrás $9.000" junto al subtotal. */
export function GiftSavings({ gift, tone = "dark" }: { gift: GiftInfo | null; tone?: "dark" | "light" }) {
  if (!gift || gift.quantity === 0 || gift.value <= 0) return null;
  return (
    <p className={cn("flex items-center justify-between text-sm", tone === "light" ? "text-[#b91c1c]" : "text-red-300")}>
      <span className="inline-flex items-center gap-1.5">
        <Gift className="size-4" /> Ahorrás con la preventa
      </span>
      <span className="font-medium tabular-nums">{currency.format(gift.value * gift.quantity)}</span>
    </p>
  );
}
