import { Order } from "@/lib/interface/Order";
import { Product } from "@/lib/interface/ProductInterface";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import React from "react";

interface Props {
    items: {
productId:string;
name:string;
image:string;
price:number;
quantity:number;
subtotal:number;
    }[]
}

export default function ProductsDetails({items}:Props) {
  return (
    <div className="px-6 py-7 sm:px-8">
      <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.17em]">
          Productos
        </p>

        <p className="text-[10px] uppercase tracking-[0.14em] text-black/40">
          {items.length} {items.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item, index) => (
          <div
            key={`${item.productId}-${index}`}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex min-w-0 gap-4">
              {/* Product image */}

              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-black/10 bg-[#f4f4f1]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package
                    className="h-5 w-5 text-black/30"
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* Product information */}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.name}</p>

                <p className="mt-1 text-xs text-black/45">
                  Cantidad: {item.quantity}
                </p>

                <p className="mt-1 text-xs text-black/45">
                  {formatPrice(item.price)} c/u
                </p>
              </div>
            </div>

            <p className="shrink-0 text-sm font-semibold">
              {formatPrice(item.subtotal)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
