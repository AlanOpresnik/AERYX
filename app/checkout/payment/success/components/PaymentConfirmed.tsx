import { Order } from "@/lib/interface/Order";
import { Check } from "lucide-react";
import React from "react";

interface Props {
    mounted: boolean;
    order: Order
}

export default function PaymentConfirmed({mounted,order}:Props) {
  return (
    <section
      className={`mb-12 text-center transition-all duration-700 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full border border-black/10 opacity-20" />

        <div className="absolute -inset-3 rounded-full border border-black/5" />

        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#c9f158]">
          <Check className="h-11 w-11" strokeWidth={2} />
        </div>
      </div>

      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
        {order.payment.status === "approved"
          ? "Pago realizado correctamente"
          : "Pedido recibido correctamente"}
      </p>

      <h1 className="font-display text-5xl tracking-[-0.07em] sm:text-7xl lg:text-8xl">
        ¡Compra confirmada!
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-black/50">
        Gracias por tu compra. Recibimos correctamente tu pedido y ya estamos
        preparando todo para enviártelo.
      </p>
    </section>
  );
}
