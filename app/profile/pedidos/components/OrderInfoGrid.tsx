import { CreditCard, Truck } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/interface/Order";
import { formatPaymentMethod, formatPaymentStatus } from "@/lib/interface/order-helper";

export function OrderInfoGrid({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-1 border-t border-black/10 sm:grid-cols-3">
      {/* PAYMENT */}
      <div className="border-b border-black/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
        <div className="mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-black/60" strokeWidth={1.5} />
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
            Pago
          </p>
        </div>
        <p className="text-sm font-semibold">
          {formatPaymentMethod(order.payment?.method)}
        </p>
        <p className="mt-1 text-xs text-black/45">
          {formatPaymentStatus(order.payment?.status)}
        </p>
      </div>

      {/* SHIPPING */}
      <div className="border-b border-black/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
        <div className="mb-3 flex items-center gap-2">
          <Truck className="h-4 w-4 text-black/60" strokeWidth={1.5} />
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
            Envío
          </p>
        </div>
        <p className="text-sm font-semibold">
          {order.shipping?.option?.title ||
            (order.shipping?.manual ? "A coordinar" : "Envío estándar")}
        </p>
        <p className="mt-1 text-xs text-black/45">
          {order.shipping?.manual
            ? "Costo a coordinar"
            : formatPrice(order.shipping?.cost || 0)}
        </p>
      </div>

      {/* TOTAL */}
      <div className="px-5 py-5 sm:px-7">
        <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
          Total
        </p>
        <p className="font-display text-3xl tracking-[-0.05em]">
          {formatPrice(order.totals?.total || 0)}
        </p>
      </div>
    </div>
  );
}