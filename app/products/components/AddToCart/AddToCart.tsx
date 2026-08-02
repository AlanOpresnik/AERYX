import React from "react";
import Quantity from "../Quantity/Quantity";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";

interface AddToCartProps {
  quantity: number;
  setQuantity: (value: React.SetStateAction<number>) => void;
  added: boolean;
  addToCart: () => void;
}

export default function AddToCart({ quantity, setQuantity, added, addToCart }: AddToCartProps) {
  return (
    <div className="mt-5 flex gap-2">
      <Quantity quantity={quantity} setQuantity={setQuantity} />

      <Button
        onClick={addToCart}
        className="h-14 flex-1 rounded-lg font-mono text-xs uppercase tracking-[0.12em]"
      >
        {added ? (
          <>
            <Check data-icon="inline-start" />
            Agregado
          </>
        ) : (
          <>
            <ShoppingBag data-icon="inline-start" />
            Agregar al carrito
            <ArrowRight data-icon="inline-end" />
          </>
        )}
      </Button>
    </div>
  );
}
