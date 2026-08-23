import { ArrowDownUp, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import React from "react";

interface Props {
  setMobileFilters: (value: boolean) => void;
  setSort: (value: string) => void;
  sort: string;
}

export default function Filters({ setMobileFilters, setSort, sort }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setMobileFilters(true)}
        className="flex items-center gap-2 border border-black/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" /> Filtrar
      </button>
      <label className="flex items-center gap-2 border border-black/20 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
        <ArrowDownUp className="h-4 w-4" />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="bg-transparent outline-none"
        >
          <option value="featured">Destacados</option>
          <option value="price-low">Precio: menor</option>
          <option value="price-high">Precio: mayor</option>
        </select>
      </label>
    </div>
  );
}
