import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  quantity: number;
  setQuantity: (value: React.SetStateAction<number>) => void;
  max?: number;
}

export default function Quantity({ quantity, setQuantity, max = 8 }: Props) {
  return (
    <div className="flex h-14 shrink-0 items-center rounded-full border border-border px-1">
      <button
        className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        type="button"
        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
        disabled={quantity <= 1}
        aria-label="Reducir cantidad"
      >
        <Minus className="size-4" />
      </button>
      <output className="w-7 text-center text-sm tabular-nums" aria-live="polite">
        {quantity}
      </output>
      <button
        className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
        type="button"
        onClick={() => setQuantity((value) => Math.min(max, value + 1))}
        disabled={quantity >= max}
        aria-label="Aumentar cantidad"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
