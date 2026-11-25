"use client";

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cartContext";
import type { CheckoutItem } from "@/lib/interface/cart";
import { currency } from "@/lib/utils";

type Suggestion = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  reason: string;
  variant: { id: number; name: string } | null;
};

const DISMISSED_KEY = "aeryx:sugerencias-descartadas";

function readDismissed(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Sugerencias opcionales debajo de los productos del carrito.
 * Nada se agrega solo: el cliente decide con "Agregar" o lo descarta con "No, gracias".
 */
export function CartSuggestions({
  items,
  onNavigate,
  hide = [],
}: {
  items: CheckoutItem[];
  onNavigate: () => void;
  /** Productos que no tiene sentido ofrecer (ej. el que ya va de regalo) */
  hide?: string[];
}) {
  const { addToCart, loading } = useCart();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDismissed(readDismissed()), []);

  // Clave estable: solo se vuelve a pedir si cambia qué hay en el carrito
  const key = items.map((i) => `${i.productId}:${i.quantity}`).join(",");

  useEffect(() => {
    if (!key) return setSuggestions([]);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ productId: i.productId, subtotal: i.price * i.quantity })),
          }),
          signal: controller.signal,
        });
        const data = await res.json();
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
      } catch {
        // Sin sugerencias no pasa nada: el carrito sigue funcionando
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const visible = suggestions.filter((s) => !dismissed.includes(s.productId) && !hide.includes(s.productId));
  if (visible.length === 0) return null;

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    } catch {}
  };

  const add = async (s: Suggestion) => {
    if (!s.variant) return;
    setAdding(s.productId);
    setError(null);
    try {
      await addToCart({
        productId: s.productId,
        variantId: s.variant.id,
        quantity: 1,
        name: s.name,
        price: s.price,
        image: s.image,
        variantName: s.variant.name,
      });
    } catch {
      setError("No pudimos agregarlo. Probá de nuevo.");
    } finally {
      setAdding(null);
    }
  };

  return (
    <section aria-labelledby="sugerencias-carrito" className="cart-suggestions mt-8 border-t border-border pt-6">
      <h3 id="sugerencias-carrito" className="text-sm font-medium">
        ¿Le sumás algo?
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">Opcional. Solo se agrega si lo elegís.</p>

      <ul className="mt-4 flex flex-col gap-2">
        {visible.map((s) => (
          <li key={s.productId} className="flex items-center gap-3 rounded-2xl border border-border p-2.5 pr-3">
            <Link
              href={`/products/${s.slug}`}
              onClick={onNavigate}
              className="size-16 shrink-0 overflow-hidden rounded-xl bg-[#161616]"
              tabIndex={-1}
              aria-hidden="true"
            >
              {s.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt="" className="size-full object-cover" />
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted-foreground">{s.reason}</p>
              <Link
                href={`/products/${s.slug}`}
                onClick={onNavigate}
                className="mt-0.5 line-clamp-1 text-sm font-medium hover:underline hover:underline-offset-4"
              >
                {s.name}
              </Link>
              <p className="mt-0.5 text-sm tabular-nums">
                {currency.format(s.price)}
                {s.originalPrice > s.price && (
                  <span className="ml-2 text-xs text-muted-foreground line-through">
                    {currency.format(s.originalPrice)}
                  </span>
                )}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {s.variant ? (
                <button
                  type="button"
                  onClick={() => add(s)}
                  disabled={loading || adding !== null}
                  aria-label={`Agregar ${s.name} al carrito`}
                  className="press inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-xs font-medium text-background transition-[background-color,transform,opacity] duration-150 hover:bg-white disabled:opacity-60"
                >
                  {adding === s.productId ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                  Agregar
                </button>
              ) : (
                <Link
                  href={`/products/${s.slug}`}
                  onClick={onNavigate}
                  className="press inline-flex h-9 items-center rounded-full border border-border px-3.5 text-xs font-medium transition-[border-color,transform] duration-150 hover:border-foreground/40"
                >
                  Elegir opción
                </Link>
              )}
              <button
                type="button"
                onClick={() => dismiss(s.productId)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                No, gracias
              </button>
            </div>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}
