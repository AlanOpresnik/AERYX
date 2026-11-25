"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/cartContext";
import { confirmationUrl, forgetPendingOrder, readPendingOrder } from "@/lib/pending-order";

/** Con el pago terminado: vacía el carrito y olvida el pedido pendiente. */
export function AfterPurchase({ completed }: { completed: boolean }) {
  const { clearCart } = useCart();
  useEffect(() => {
    if (!completed) return;
    clearCart();
    forgetPendingOrder();
  }, [completed, clearCart]);
  return null;
}

/** Sin datos en la URL: usa el pedido que este navegador fue a pagar. */
export function PendingOrderResolver({ fallback }: { fallback: React.ReactNode }) {
  const router = useRouter();
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const pending = readPendingOrder();
    if (pending) router.replace(confirmationUrl(pending));
    else setMissing(true);
  }, [router]);
  return missing ? <>{fallback}</> : <div className="min-h-svh" />;
}
