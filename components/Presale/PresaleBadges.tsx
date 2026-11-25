"use client";

import { ArrowRight, Gift } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isPresaleOpen, PRESALE_GIFT, qualifiesForGift } from "@/lib/presale";
import { usePresaleConfig } from "./PresaleContext";
import { cn, currency } from "@/lib/utils";

/**
 * ¿Está abierta la preventa? Se decide en el navegador con la hora real:
 * así las páginas cacheadas igual muestran los sellos desde el minuto uno.
 */
export function usePresaleOpen(): boolean {
  const config = usePresaleConfig();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(isPresaleOpen(config));
    const id = setInterval(() => setOpen(isPresaleOpen(config)), 60_000);
    return () => clearInterval(id);
  }, [config]);
  return open;
}

const shortDate = (d: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

/** Sello sobre la foto de la tarjeta de producto. */
export function PresaleCardBadge({ category }: { category?: string }) {
  const config = usePresaleConfig();
  const open = usePresaleOpen();
  if (!open) return null;
  const gift = qualifiesForGift(config, category);
  return (
    <span
      className={cn(
        "presale-badge absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        gift ? "bg-[#070707] text-[#f4f4f2]" : "bg-[#f4f4f2]/90 text-[#070707]",
      )}
    >
      {gift && <Gift className="size-3 text-accent" />}
      {gift ? `Preventa · ${PRESALE_GIFT.name.split(" ")[0]} de regalo` : "Preventa"}
    </span>
  );
}

export type GiftPreview = { name: string; image: string; value: number };

/** Bloque de preventa en la ficha, justo antes de agregar al carrito. */
export function PresaleProductNote({
  category,
  productId,
  gift,
}: {
  category?: string;
  productId: string;
  gift: GiftPreview | null;
}) {
  const config = usePresaleConfig();
  const open = usePresaleOpen();
  if (!open) return null;

  const when = config.shipsFrom ? `Despacho desde el ${shortDate(config.shipsFrom)}` : `Hasta el ${shortDate(config.endsOn)}`;

  // Esta es la manga que se regala: le contamos cómo llevársela gratis
  if (productId === PRESALE_GIFT.sourceProductId) {
    return (
      <div className="presale-note rounded-2xl border border-border p-4 text-sm">
        <p className="font-medium">Preventa · {when}</p>
        <p className="mt-1 text-muted-foreground">
          Comprando un mousepad, esta manga va de regalo en tu pedido.
        </p>
        <Link href="/catalog" className="mt-3 inline-flex items-center gap-1.5 font-medium underline underline-offset-4">
          Ver mousepads <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  if (!qualifiesForGift(config, category) || !gift) {
    return (
      <p className="presale-note rounded-2xl border border-border px-4 py-3 text-sm">
        <span className="font-medium">Preventa</span> <span className="text-muted-foreground">· {when}</span>
      </p>
    );
  }

  return (
    <div className="presale-note flex items-center gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-3 pr-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#161616]">
        {gift.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gift.image} alt="" className="size-full object-cover" />
        )}
        <span aria-hidden="true" className="absolute bottom-1 right-1 grid size-5 place-items-center rounded-full bg-accent text-[#070707]">
          <Gift className="size-3" />
        </span>
      </div>
      <div className="min-w-0 text-sm">
        <p className="font-medium">Te llevás de regalo una {gift.name.toLowerCase()}</p>
        <p className="mt-0.5 text-muted-foreground">
          {gift.value > 0 && <>Valor {currency.format(gift.value)} · </>}
          Se suma sola al pagar · {when}
        </p>
      </div>
    </div>
  );
}
