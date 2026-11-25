"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveProfile, type SaveState } from "../actions";

const PROVINCES = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

type Values = {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  number: string;
  floorApt: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
};

const inputClass =
  "h-12 w-full rounded-xl border bg-[#0f0f0f] px-4 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#6f6f6f] hover:border-foreground/25 focus:border-foreground/50 focus:ring-4 focus:ring-foreground/10 aria-[invalid=true]:border-red-400/60";

function Field({
  name,
  label,
  hint,
  error,
  className,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {hint && <span className="font-normal text-muted-foreground"> · {hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-[0.8125rem] text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function ProfileForm({ initial, email }: { initial: Values; email: string }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveProfile, { status: "idle" });
  const [dirty, setDirty] = useState(false);
  const errors = state.status === "error" ? (state.fields ?? {}) : {};

  useEffect(() => {
    if (state.status === "saved") setDirty(false);
  }, [state]);

  const input = (name: keyof Values, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      id={name}
      name={name}
      defaultValue={initial[name]}
      aria-invalid={Boolean(errors[name])}
      aria-describedby={errors[name] ? `${name}-error` : undefined}
      className={cn(inputClass, errors[name] ? "border-red-400/60" : "border-border")}
      {...props}
    />
  );

  return (
    <form action={action} onChange={() => setDirty(true)} noValidate className="flex flex-col gap-12">
      <fieldset className="grid gap-x-4 gap-y-5 md:grid-cols-[14rem_1fr_1fr]">
        <legend className="contents">
          <span className="mb-1 md:mb-0 md:row-span-3">
            <span className="block font-medium">Datos personales</span>
            <span className="mt-1 block text-sm text-muted-foreground">Así te vamos a nombrar en tus pedidos.</span>
          </span>
        </legend>
        <Field name="firstName" label="Nombre" error={errors.firstName}>
          {input("firstName", { autoComplete: "given-name", required: true })}
        </Field>
        <Field name="lastName" label="Apellido" error={errors.lastName}>
          {input("lastName", { autoComplete: "family-name" })}
        </Field>
        <Field name="email" label="Mail" hint="se cambia en Seguridad" className="md:col-start-2">
          <input
            id="email"
            value={email}
            readOnly
            className={cn(inputClass, "border-border text-muted-foreground hover:border-border focus:ring-0")}
          />
        </Field>
        <Field name="phone" label="Teléfono" hint="opcional" error={errors.phone}>
          {input("phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "11 5555 1234" })}
        </Field>
      </fieldset>

      <div className="h-px bg-border" />

      <fieldset className="grid gap-x-4 gap-y-5 md:grid-cols-[14rem_1fr_1fr]">
        <legend className="contents">
          <span className="mb-1 md:mb-0 md:row-span-5">
            <span className="block font-medium">Dirección de envío</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              La guardamos para que la tengas a mano cuando compres.
            </span>
          </span>
        </legend>
        <Field name="street" label="Calle" error={errors.street}>
          {input("street", { autoComplete: "address-line1", placeholder: "Av. Corrientes" })}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field name="number" label="Altura" error={errors.number}>
            {input("number", { inputMode: "numeric", placeholder: "1234" })}
          </Field>
          <Field name="floorApt" label="Piso / depto" error={errors.floorApt}>
            {input("floorApt", { autoComplete: "address-line2", placeholder: "4° B" })}
          </Field>
        </div>
        <Field name="city" label="Ciudad o localidad" error={errors.city} className="md:col-start-2">
          {input("city", { autoComplete: "address-level2" })}
        </Field>
        <Field name="postalCode" label="Código postal" error={errors.postalCode}>
          {input("postalCode", { autoComplete: "postal-code", placeholder: "1425" })}
        </Field>
        <Field name="province" label="Provincia" error={errors.province} className="md:col-start-2">
          <select
            id="province"
            name="province"
            defaultValue={initial.province}
            autoComplete="address-level1"
            aria-invalid={Boolean(errors.province)}
            className={cn(inputClass, "appearance-none", errors.province ? "border-red-400/60" : "border-border")}
          >
            <option value="">Elegí una provincia</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field name="notes" label="Indicaciones" hint="opcional" error={errors.notes}>
          {input("notes", { placeholder: "Timbre, horario, entre calles…" })}
        </Field>
      </fieldset>

      {/* Barra de guardado: queda al final y avisa el resultado */}
      <div className="flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
        <p role="status" aria-live="polite" className="text-sm sm:mr-auto">
          {state.status === "saved" && !dirty && (
            <span className="inline-flex items-center gap-2 text-emerald-300">
              <Check className="size-4" /> Cambios guardados
            </span>
          )}
          {state.status === "error" && <span className="text-red-300">{state.message}</span>}
          {dirty && state.status !== "error" && <span className="text-muted-foreground">Tenés cambios sin guardar</span>}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 text-[0.9375rem] font-medium text-background transition-[background-color,transform,opacity] duration-150 hover:bg-white disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
