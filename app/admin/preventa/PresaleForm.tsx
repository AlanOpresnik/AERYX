"use client";

import { useActionState, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { PresaleConfig } from "@/lib/presale";
import { cn } from "@/lib/utils";
import { savePresale, type PresaleFormState } from "./actions";

const input =
  "h-11 w-full rounded-xl border bg-transparent px-3.5 text-sm outline-none transition-[border-color] duration-150 placeholder:text-muted-foreground/70 focus:border-foreground/50 [color-scheme:dark]";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">
        {label}
        {hint && <span className="font-normal text-muted-foreground"> · {hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

export function PresaleForm({
  config,
  categories,
  giftStock,
}: {
  config: PresaleConfig;
  categories: string[];
  giftStock: number | null;
}) {
  const [state, action, pending] = useActionState<PresaleFormState, FormData>(savePresale, { status: "idle" });
  const [stockTouched, setStockTouched] = useState(false);
  const errors = state.status === "error" ? (state.fields ?? {}) : {};
  const border = (k: string) => (errors[k] ? "border-red-400/60" : "border-border");
  const cats = [...new Set([...categories, config.qualifyingCategory].filter(Boolean))];

  return (
    <form action={action} noValidate className="flex flex-col gap-6">
      <label className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 text-sm">
        <span>
          <span className="block font-medium">Preventa activa</span>
          <span className="text-muted-foreground">Apagada, no se muestran sellos ni se agrega el regalo aunque esté en fecha.</span>
        </span>
        <input type="checkbox" name="enabled" defaultChecked={config.enabled} className="size-5 shrink-0 accent-[#f87171]" />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Empieza" hint="00:00" error={errors.startsOn}>
          <input type="date" name="startsOn" defaultValue={config.startsOn} className={cn(input, border("startsOn"))} />
        </Field>
        <Field label="Termina" hint="23:59" error={errors.endsOn}>
          <input type="date" name="endsOn" defaultValue={config.endsOn} className={cn(input, border("endsOn"))} />
        </Field>
        <Field label="Despacho desde" hint="opcional" error={errors.shipsFrom}>
          <input type="date" name="shipsFrom" defaultValue={config.shipsFrom} className={cn(input, border("shipsFrom"))} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Da regalo la categoría" error={errors.qualifyingCategory}>
          <select name="qualifyingCategory" defaultValue={config.qualifyingCategory} className={cn(input, border("qualifyingCategory"))}>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Regalos disponibles" hint="vacío = sin tope" error={errors.giftStock}>
          <input
            type="number"
            name="giftStock"
            min={0}
            inputMode="numeric"
            defaultValue={giftStock ?? ""}
            onChange={() => setStockTouched(true)}
            placeholder="Sin tope"
            className={cn(input, border("giftStock"))}
          />
          <input type="hidden" name="giftStockTouched" value={stockTouched ? "1" : "0"} />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="mb-2 font-medium">Cuántas mangas</legend>
        <label className="flex items-center gap-3">
          <input type="radio" name="perUnit" value="unit" defaultChecked={config.perUnit} className="accent-[#f87171]" />
          Una por cada producto que califica <span className="text-muted-foreground">(2 mousepads = 2 mangas)</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="radio" name="perUnit" value="order" defaultChecked={!config.perUnit} className="accent-[#f87171]" />
          Una por pedido
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
        <p role="status" aria-live="polite" className="mr-auto text-sm">
          {state.status === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-emerald-300">
              <Check className="size-4" /> Guardado. La tienda lo aplica en unos segundos.
            </span>
          )}
          {state.status === "error" && <span className="text-red-300">{state.message}</span>}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="press inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-[background-color,transform,opacity] duration-150 hover:bg-white disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Guardando…" : "Guardar preventa"}
        </button>
      </div>
    </form>
  );
}
