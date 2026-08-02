import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  quantity: number;
  setQuantity: (value: React.SetStateAction<number>) => void;
}

export default function Quantity({ quantity, setQuantity }: Props) {
  return (
    <div className="flex h-14 shrink-0 items-center rounded-lg border border-border">
      <button
        className="grid size-12 place-items-center"
        type="button"
        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
        aria-label="Reducir cantidad"
      >
        <Minus className="size-4" />
      </button>
      <output className="w-8 text-center text-sm" aria-live="polite">
        {quantity}
      </output>
      <button
        className="grid size-12 place-items-center"
        type="button"
        onClick={() => setQuantity((value) => Math.min(8, value + 1))}
        aria-label="Aumentar cantidad"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
