"use client";

import { Check, Search, X } from "lucide-react";
import { useEffect } from "react";
import { cn, currency } from "@/lib/utils";

function FilterHeading({ children }: { children: string }) {
  return <p className="mb-4 text-sm font-medium">{children}</p>;
}

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between py-1.5 text-[15px]">
      <span className="flex items-center gap-3">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span
          aria-hidden="true"
          className={cn(
            "grid size-[18px] place-items-center rounded-[5px] border transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-background",
            checked
              ? "border-background bg-background text-foreground"
              : "border-neutral-400 group-hover:border-background",
          )}
        >
          {checked && <Check className="size-3" strokeWidth={3} />}
        </span>
        {label}
      </span>
      {count !== undefined && (
        <span className="text-sm text-neutral-500 tabular-nums">{count}</span>
      )}
    </label>
  );
}

interface Props {
  categories: { name: string; count: number }[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  maxPrice: number;
  priceCeiling: number;
  setMaxPrice: (value: number) => void;
  onlyInStock: boolean;
  setOnlyInStock: (value: boolean) => void;
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
  canClear: boolean;
  resultCount: number;
  mobileOpen: boolean;
  closeMobile: () => void;
}

export function FilterPanel({
  categories,
  selectedCategories,
  toggleCategory,
  maxPrice,
  priceCeiling,
  setMaxPrice,
  onlyInStock,
  setOnlyInStock,
  search,
  setSearch,
  clear,
  canClear,
  resultCount,
  mobileOpen,
  closeMobile,
}: Props) {
  // Cerrar el panel móvil con Escape y bloquear el scroll de fondo
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen, closeMobile]);

  const step = Math.max(1, Math.round(priceCeiling / 100));

  return (
    <>
      {/* Fondo del panel móvil */}
      <div
        aria-hidden="true"
        onClick={closeMobile}
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ease-out lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label="Filtros"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(340px,88vw)] flex-col overflow-y-auto bg-foreground p-6 transition-[transform,visibility] duration-[400ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]",
          "lg:visible lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:transition-none",
          mobileOpen ? "visible translate-x-0" : "invisible translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <p className="text-2xl tracking-[-0.03em]">Filtros</p>
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Cerrar filtros"
            className="press grid size-10 place-items-center rounded-full transition-[background-color,transform] duration-200 hover:bg-neutral-200"
          >
            <X className="size-5" />
          </button>
        </div>

        <div>
          <label className="relative mb-10 block">
            <span className="sr-only">Buscar productos</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar"
              className="h-11 w-full rounded-full border border-neutral-300 bg-transparent pl-10 pr-4 text-[15px] outline-none transition-colors duration-200 placeholder:text-neutral-500 focus:border-background focus-visible:outline-none"
            />
          </label>

          {categories.length > 0 && (
            <div className="mb-10">
              <FilterHeading>Categoría</FilterHeading>
              {categories.map((category) => (
                <CheckRow
                  key={category.name}
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => toggleCategory(category.name)}
                  label={category.name}
                  count={category.count}
                />
              ))}
            </div>
          )}

          {priceCeiling > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-baseline justify-between">
                <p className="text-sm font-medium">Precio máximo</p>
                <span className="text-sm tabular-nums">{currency.format(maxPrice)}</span>
              </div>
              <input
                aria-label="Precio máximo"
                type="range"
                min={0}
                max={priceCeiling}
                step={step}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full cursor-pointer accent-[#070707]"
              />
              <div className="mt-2 flex justify-between text-xs text-neutral-500 tabular-nums">
                <span>{currency.format(0)}</span>
                <span>{currency.format(priceCeiling)}</span>
              </div>
            </div>
          )}

          <div className="mb-10">
            <FilterHeading>Disponibilidad</FilterHeading>
            <CheckRow
              checked={onlyInStock}
              onChange={() => setOnlyInStock(!onlyInStock)}
              label="Solo en stock"
            />
          </div>

          {canClear && (
            <button
              type="button"
              onClick={clear}
              className="text-sm text-neutral-600 underline underline-offset-4 transition-colors duration-200 hover:text-background"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={closeMobile}
          className="press mt-auto h-12 w-full shrink-0 rounded-full bg-background text-[15px] font-medium text-foreground transition-transform duration-150 lg:hidden"
        >
          Ver {resultCount} producto{resultCount === 1 ? "" : "s"}
        </button>
      </aside>
    </>
  );
}
