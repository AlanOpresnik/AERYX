// components/cart/CartSidebar.tsx
"use client";
import { mono } from "@/lib/products-mock-data";
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cartContext";
import { CheckoutItem } from "@/lib/interface/cart";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, loading, validateCart } = useCart();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bloquea scroll del body mientras el sidebar está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Trae datos actualizados (nombre/precio/stock) cada vez que se abre
  // o cambia el carrito, reusando tu validateCart
  useEffect(() => {
    if (!isOpen) return;

    if (cart.length === 0) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setValidating(true);
    setError(null);

    (async () => {
      try {
        const validated = await validateCart(cart);

        if (!cancelled) setItems(validated);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el carrito",
          );
        }
      } finally {
        if (!cancelled) setValidating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, cart, validateCart]);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-border bg-black text-foreground transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className={`${mono} text-lg font-semibold`}>
            Tu carrito {cart.length > 0 && `(${cart.length})`}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Contenido */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <ShoppingBag className="size-10" />
            <p className={mono}>Tu carrito está vacío</p>
          </div>
        ) : validating && items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
            <p className={mono}>{error}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4">
                  <div className="size-20 shrink-0 overflow-hidden rounded-md bg-neutral-900">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <p className={`${mono} text-sm font-medium`}>
                          {item.name}
                        </p>
                        {item.variantName && item.variantName !== "Único" && (
                          <p className={`${mono} text-xs text-muted-foreground mt-1`}>
                            {item.variantName}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        disabled={loading}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.variantId,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                          disabled={loading}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                          aria-label="Restar cantidad"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className={`${mono} w-4 text-center text-sm`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          disabled={loading}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                          aria-label="Sumar cantidad"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <span className={`${mono} text-sm`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer con total y checkout */}
        {cart.length > 0 && !error && (
          <div className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className={`${mono} text-muted-foreground`}>Subtotal</span>
              <span className={`${mono} text-lg font-semibold`}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className={`${mono} flex w-full !text-black items-center justify-center gap-2 rounded-md bg-foreground py-3 text-background transition-opacity hover:opacity-90 ${
                validating ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Finalizar compra
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
