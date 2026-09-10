"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { CheckoutItem } from "@/lib/interface/cart";
import { useCart } from "../context/cartContext";
import { Footer } from "@/components/Footer/Footer";
import CartError from "./components/CartError";
import AsideProducts from "./components/AsideProducts/AsideProducts";

export default function Checkout({ onBack }: { onBack: () => void }) {
  const {
    cart,
    validateCart,
    updateQuantity,
    removeFromCart,
    loading: cartLoading,
  } = useCart();
  const { user } = useUser();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");

  useEffect(() => {
    if (user) {
      if (!guestEmail) setGuestEmail(user.primaryEmailAddress?.emailAddress || "");
      if (!guestName) setGuestName(user.firstName || "");
      if (!guestLastName) setGuestLastName(user.lastName || "");
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      try {
        setLoadingCart(true);
        setCartError(null);

        if (!cart.length) {
          if (!cancelled) setItems([]);
          return;
        }

        const validatedItems = await validateCart(cart);

        if (!cancelled) setItems(validatedItems);
      } catch (error) {
        if (cancelled) return;

        console.error("Error validando carrito:", error);
        setCartError(
          error instanceof Error
            ? error.message
            : "No se pudo validar el carrito",
        );
      } finally {
        if (!cancelled) setLoadingCart(false);
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [cart, validateCart]);

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const item = items.find((i) => i.productId === productId || String(i.variantId) === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(item.variantId);
      return;
    }

    updateQuantity(item.variantId, newQuantity);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!guestEmail || !guestName || !guestLastName) {
      alert("Por favor completá tu nombre, apellido y email para continuar");
      return;
    }

    try {
      setIsCreatingCheckout(true);
      
      const payload = {
        items: items.map(item => ({ variantId: item.variantId, quantity: item.quantity })),
        contactEmail: guestEmail,
        contactName: guestName,
        contactLastname: guestLastName,
      };

      const response = await fetch('/api/tiendanube/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al crear el checkout');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert(error instanceof Error ? error.message : 'Ocurrió un error al procesar tu compra');
      setIsCreatingCheckout(false);
    }
  };

  if (loadingCart && !items.length) {
    return (
      <main className="mt-32 min-h-screen bg-[#f4f4f1] text-[#101010]">
        <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-12 lg:pt-16">
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-black/45">
              Validando carrito...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (cartError) return <CartError cartError={cartError} onBack={onBack} />;

  return (
    <main className="mt-32 min-h-screen bg-[#f4f4f1] text-[#101010]">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-12 lg:pt-16">
        <div className="mb-10 flex items-start justify-between border-b border-black/60 pb-3">
          <p className="eyebrow">Finalizar compra</p>
          <p className="eyebrow hidden sm:block">
            Carrito / {items.length} {items.length === 1 ? "artículo" : "artículos"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* COLUMNA IZQUIERDA: PRODUCTOS */}
          <div className="lg:col-span-7">
            <div className="border border-black/15 bg-white/40">
              <div className="border-b border-black/15 px-5 py-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.17em]">
                  Resumen de tu pedido
                </p>
              </div>

              <div className="divide-y divide-black/10">
                <AsideProducts
                  cartLoading={cartLoading}
                  handleUpdateQuantity={handleUpdateQuantity}
                  items={items}
                />

                {!items.length && (
                  <div className="px-5 py-10 text-center text-sm text-black/45">
                    Tu carrito está vacío.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: DATOS Y BOTÓN */}
          <aside className="lg:col-span-5 lg:sticky lg:top-36 h-fit">
            <div className="border border-black/15 bg-white/40">
              <div className="px-5 py-6 space-y-6">
                  <div className="flex flex-col space-y-5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-black pb-3 border-b border-black/10">
                      Tus Datos de Contacto
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/60">
                          Nombre
                        </label>
                        <input 
                          type="text" 
                          id="name"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Ej: Alan"
                          className="border border-black/15 bg-white p-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="lastname" className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/60">
                          Apellido
                        </label>
                        <input 
                          type="text" 
                          id="lastname"
                          required
                          value={guestLastName}
                          onChange={(e) => setGuestLastName(e.target.value)}
                          placeholder="Ej: Opresnik"
                          className="border border-black/15 bg-white p-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/60">
                        Email
                      </label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        placeholder="alan@aeryx.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="border border-black/15 bg-white p-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                
                <div className="pt-4 mt-4 border-t border-black/10">
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em]">Subtotal</span>
                    <span className="text-xl">${subtotal.toLocaleString("es-AR")}</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={
                    isCreatingCheckout || 
                    !items.length || 
                    cartLoading || 
                    !guestEmail ||
                    !guestName ||
                    !guestLastName
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 bg-black py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/50"
                >
                  {isCreatingCheckout ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Finalizar compra en Tiendanube"
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}