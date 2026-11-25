"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { AnnouncementBarView } from "@/components/Announcement/AnnouncementBar";
import type { Announcement } from "@/lib/announcement-utils";
import { cn } from "@/lib/utils";
import { saveAnnouncement, type FormState } from "./actions";

const EMPTY: Announcement = {
  id: "",
  message: "",
  linkLabel: "",
  linkHref: "",
  startsOn: "",
  endsOn: "",
  active: true,
  updatedAt: "",
  cartTrigger: "",
  cartNote: "",
};

const input =
  "h-11 w-full rounded-xl border bg-transparent px-3.5 text-sm outline-none transition-[border-color] duration-150 placeholder:text-muted-foreground/70 focus:border-foreground/50";

function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="font-medium">
        {label}
        {hint && <span className="font-normal text-muted-foreground"> · {hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

/** Crear o editar un anuncio, con la barra tal cual se va a ver en la web. */
export function AnnouncementForm({
  initial,
  onDone,
  submitLabel = "Guardar anuncio",
  categories = [],
}: {
  categories?: string[];
  initial?: Announcement;
  onDone?: () => void;
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveAnnouncement, { status: "idle" });
  const [draft, setDraft] = useState<Announcement>({ ...EMPTY, ...initial });
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.status === "error" ? (state.fields ?? {}) : {};

  useEffect(() => {
    if (state.status !== "saved") return;
    if (!initial) {
      formRef.current?.reset();
      setDraft(EMPTY);
    }
    onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const set = <K extends keyof Announcement>(key: K, value: Announcement[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const border = (key: string) => (errors[key] ? "border-red-400/60" : "border-border");

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="id" value={draft.id} />

      <div className="overflow-hidden rounded-xl border border-border">
        <p className="border-b border-border px-3 py-1.5 text-xs text-muted-foreground">Vista previa</p>
        {draft.message ? (
          <AnnouncementBarView announcement={draft} preview />
        ) : (
          <p className="px-3 py-3 text-center text-sm text-muted-foreground">Escribí el mensaje para ver cómo queda.</p>
        )}
      </div>

      <Field label="Mensaje" hint={`${draft.message.length}/160`} error={errors.message}>
        <input
          name="message"
          value={draft.message}
          onChange={(e) => set("message", e.target.value)}
          maxLength={160}
          placeholder="Comprá un mousepad antes del 20/12 y te regalamos una manga de compresión."
          className={cn(input, border("message"))}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Texto del link" hint="opcional" error={errors.linkLabel}>
          <input
            name="linkLabel"
            value={draft.linkLabel}
            onChange={(e) => set("linkLabel", e.target.value)}
            maxLength={30}
            placeholder="Ver mousepads"
            className={cn(input, border("linkLabel"))}
          />
        </Field>
        <Field label="Lleva a" hint="opcional" error={errors.linkHref}>
          <input
            name="linkHref"
            value={draft.linkHref}
            onChange={(e) => set("linkHref", e.target.value)}
            placeholder="/catalog"
            className={cn(input, border("linkHref"))}
          />
        </Field>
        <Field label="Desde" hint="vacío = desde ya" error={errors.startsOn}>
          <input
            type="date"
            name="startsOn"
            value={draft.startsOn}
            onChange={(e) => set("startsOn", e.target.value)}
            className={cn(input, border("startsOn"), "[color-scheme:dark]")}
          />
        </Field>
        <Field label="Hasta (inclusive)" hint="vacío = sin fin" error={errors.endsOn}>
          <input
            type="date"
            name="endsOn"
            value={draft.endsOn}
            min={draft.startsOn || undefined}
            onChange={(e) => set("endsOn", e.target.value)}
            className={cn(input, border("endsOn"), "[color-scheme:dark]")}
          />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-4 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-medium">
          Aviso en el carrito <span className="font-normal text-muted-foreground">· opcional</span>
        </legend>
        <p className="-mt-1 text-xs leading-relaxed text-muted-foreground">
          Si el carrito tiene un producto de esta categoría, le confirmamos el beneficio. Si no, le recordamos la promo.
        </p>
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <Field label="Categoría" error={errors.cartTrigger}>
            <select
              name="cartTrigger"
              value={draft.cartTrigger ?? ""}
              onChange={(e) => set("cartTrigger", e.target.value)}
              className={cn(input, border("cartTrigger"), "[color-scheme:dark]")}
            >
              <option value="">Ninguna</option>
              {[...new Set([...categories, draft.cartTrigger ?? ""].filter(Boolean))].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mensaje en el carrito" hint={`${(draft.cartNote ?? "").length}/120`} error={errors.cartNote}>
            <input
              name="cartNote"
              value={draft.cartNote ?? ""}
              onChange={(e) => set("cartNote", e.target.value)}
              maxLength={120}
              disabled={!draft.cartTrigger}
              placeholder="Tu manga de compresión de regalo va incluida en este pedido."
              className={cn(input, border("cartNote"), "disabled:opacity-40")}
            />
          </Field>
        </div>
      </fieldset>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="active"
          checked={draft.active}
          onChange={(e) => set("active", e.target.checked)}
          className="size-4 accent-[#f87171]"
        />
        Publicado
        <span className="text-muted-foreground">· si lo desmarcás queda guardado pero no se muestra</span>
      </label>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <p role="status" aria-live="polite" className="mr-auto text-sm">
          {state.status === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-emerald-300">
              <Check className="size-4" /> Guardado. La web lo muestra en unos segundos.
            </span>
          )}
          {state.status === "error" && <span className="text-red-300">{state.message}</span>}
        </p>
        {onDone && initial && (
          <button type="button" onClick={onDone} className="h-10 px-3 text-sm text-muted-foreground hover:text-foreground">
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          className="press inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-[background-color,transform,opacity] duration-150 hover:bg-white disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
