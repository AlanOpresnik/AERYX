"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmationUrl, forgetPendingOrder, readPendingOrder, type PendingOrder } from "@/lib/pending-order";

const HIDDEN_ON = ["/checkout", "/admin", "/login", "/registro"];

/**
 * Si el cliente fue a pagar a Tiendanube y volvió a la web, le ofrecemos ver la confirmación.
 * No aparece hasta pasados 30 segundos de haber ido a pagar.
 */
export function PendingOrderToast() {
  const pathname = usePathname();
  const [order, setOrder] = useState<PendingOrder | null>(null);

  useEffect(() => {
    const pending = readPendingOrder();
    setOrder(pending && Date.now() - pending.at > 30_000 ? pending : null);
  }, [pathname]);

  if (!order || HIDDEN_ON.some((p) => pathname?.startsWith(p))) return null;

  return (
    <div role="status" className="pending-toast fixed bottom-4 left-4 right-4 z-[65] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border bg-[#0d0d0d] p-3 pl-4 text-sm text-foreground shadow-[0_12px_40px_-12px_rgba(0,0,0,.7)] sm:left-auto sm:right-6 sm:mx-0">
      <p className="min-w-0 flex-1">¿Ya pagaste tu pedido?</p>
      <Link
        href={confirmationUrl(order)}
        className="press inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-xs font-medium text-background"
      >
        Ver confirmación <ArrowRight className="size-3.5" />
      </Link>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => {
          forgetPendingOrder();
          setOrder(null);
        }}
        className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
