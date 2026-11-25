"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { setProductPublished } from "./actions";

export function PublishToggle({ id, published, name }: { id: number; published: boolean; name: string }) {
  const [value, setValue] = useState(published);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !value;
    setValue(next); // optimista
    setError(null);
    startTransition(async () => {
      const result = await setProductPublished(id, next);
      if (!result.ok) {
        setValue(!next);
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={`${value ? "Ocultar" : "Publicar"} ${name}`}
        disabled={pending}
        onClick={toggle}
        className="group flex items-center gap-2 text-sm disabled:opacity-60"
      >
        <span
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors duration-200",
            value ? "bg-emerald-400/80" : "bg-foreground/15",
          )}
        >
          <span
            className={cn(
              "absolute left-0.5 top-0.5 size-4 rounded-full bg-foreground transition-transform duration-200 ease-out",
              value && "translate-x-4",
            )}
          />
        </span>
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? "Publicado" : "Oculto"}
        </span>
      </button>
      {error && (
        <p role="alert" className="max-w-[14rem] text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
