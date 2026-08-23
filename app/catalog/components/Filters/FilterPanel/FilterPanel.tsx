import { Search, X } from "lucide-react";

function FilterHeading({ children }: { children: string }) {
  return (
    <p className="mb-4 border-b border-black/15 pb-3 text-[10px] font-bold uppercase tracking-[0.17em]">
      {children}
    </p>
  );
}
const categories: Array<{ name: string; count: number }> = [
  { name: "Palas", count: 18 },
  { name: "Accesorios", count: 24 },
  { name: "Calzado", count: 12 },
];

export function FilterPanel({
  selectedCategories,
  toggleCategory,
  maxPrice,
  setMaxPrice,
  search,
  setSearch,
  clear,
  mobileOpen,
  closeMobile,
}: {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
  mobileOpen: boolean;
  closeMobile: () => void;
}) {
  return (
    <aside
      className={`${mobileOpen ? "fixed inset-0 z-50 flex bg-black/45" : "hidden"} lg:static lg:block lg:bg-transparent`}
    >
      <div
        className={`${mobileOpen ? "ml-auto flex h-full w-[320px] flex-col overflow-y-auto bg-[#f4f4f1] p-6" : ""} lg:w-auto lg:p-0`}
      >
        <div className="mb-7 flex items-center justify-between lg:hidden">
          <p className="font-display text-3xl tracking-[-0.06em]">Filtros</p>
          <button onClick={closeMobile}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative mb-9">
          <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar"
            className="w-full border-b border-black/25 bg-transparent py-3 pl-7 text-sm outline-none placeholder:text-black/40"
          />
        </div>
        <FilterHeading>Tipo de producto</FilterHeading>
        <div className="mb-9 space-y-3">
          {categories.map((category) => (
            <label
              key={category.name}
              className="flex cursor-pointer items-center justify-between text-sm"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => toggleCategory(category.name)}
                  className="h-4 w-4 accent-black"
                />
                {category.name}
              </span>
              <span className="text-xs text-black/35">{category.count}</span>
            </label>
          ))}
        </div>
        <FilterHeading>Precio máximo</FilterHeading>
        <div className="mb-9">
          <div className="mb-3 flex justify-between text-sm">
            <span>Hasta</span>
            <span className="font-semibold">${maxPrice}</span>
          </div>
          <input
            aria-label="Precio máximo"
            type="range"
            min="0"
            max="999990"
            step="100"
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="w-full accent-black"
          />
          <div className="mt-2 flex justify-between text-[10px] text-black/40">
            <span>$0</span>
            <span>$90000+</span>
          </div>
        </div>
        <FilterHeading>Disponibilidad</FilterHeading>
        <label className="mb-8 flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 accent-black"
          />{" "}
          Solo en stock
        </label>
        <button
          onClick={clear}
          className="border-b border-black pb-1 text-[10px] font-bold uppercase tracking-[0.16em]"
        >
          Limpiar filtros
        </button>
        <button
          onClick={closeMobile}
          className="mt-8 w-full bg-black py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white lg:hidden"
        >
          Ver productos
        </button>
      </div>
    </aside>
  );
}
