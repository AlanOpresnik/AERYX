import React from "react";

interface Props {
    subtotal:number;
    shippingCost:Number;
    total:number;
}

export default function Summary({shippingCost,subtotal,total}:Props) {
  return (
    <div className="space-y-2 border-t border-black/15 px-5 py-4 text-sm">
      <div className="flex justify-between text-black/55">
        <span>Subtotal</span>

        <span>€{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-black/55">
        <span>Envío</span>

        <span>
          {shippingCost === 0 ? "Gratis" : `€${shippingCost.toFixed(2)}`}
        </span>
      </div>

      <div className="mt-2 flex justify-between border-t border-black/15 pt-3 text-base font-semibold">
        <span>Total</span>

        <span>€{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
