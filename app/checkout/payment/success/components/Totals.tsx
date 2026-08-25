import { Order } from "@/lib/interface/Order";
import { formatPrice } from "@/lib/utils";
import React from "react";

interface Props {
    subtotal:number;
    shippingCost:number;
    total:number;
    order:Order;
}

export default function Totals({shippingCost,subtotal,total,order}:Props) {
  return (
    <div className="border-t border-dashed border-black/20 px-6 py-7 sm:px-8">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-black/50">Subtotal</span>

          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-black/50">Envío</span>

          <span className="font-semibold">
            {order.shipping.manual ? "A coordinar" : formatPrice(shippingCost)}
          </span>
        </div>

        <div className="mt-5 flex justify-between border-t border-black/10 pt-5">
          <span className="text-sm font-bold uppercase tracking-[0.12em]">
            Total
          </span>

          <span className="font-display text-3xl tracking-[-0.05em]">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
