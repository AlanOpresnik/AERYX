import { ChevronDown, SlidersHorizontal } from "lucide-react";
import React from "react";

interface Props {
  setMobileFilters: (value: boolean) => void;
  setSort: (value: string) => void;
  sort: string;
  activeFilters?: number;
}

export default function Filters({ setMobileFilters, setSort, sort, activeFilters = 0 }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setMobileFilters(true)}
        className="press flex h-11 items-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-medium transition-[border-color,transform] duration-200 ease-out hover:border-background lg:hidden"
      >
        <SlidersHorizontal className="size-4" />
        Filtros
        {activeFilters > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-background text-[11px] text-foreground tabular-nums">
            {activeFilters}
          </span>
        )}
      </button>
      <label className="relative flex h-11 items-center rounded-full border border-neutral-300 transition-colors duration-200 focus-within:border-background hover:border-background">
        <span className="sr-only">Ordenar por</span>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-full cursor-pointer appearance-none rounded-full bg-transparent pl-4 pr-10 text-sm font-medium outline-none"
        >
          <option value="featured">Destacados</option>
          <option value="price-low">Precio: menor a mayor</option>
          <option value="price-high">Precio: mayor a menor</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 size-4" />
      </label>
    </div>
  );
}
