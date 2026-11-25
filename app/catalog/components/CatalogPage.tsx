"use client";
import ProductCard from "@/components/Shop/ProductCard/ProductCard";
import { Product } from "@/lib/interface/ProductInterface";
import { isOutOfStock } from "@/lib/product-stock";
import { useCallback, useMemo, useState } from "react";
import Filters from "./Filters/Filters";
import { FilterPanel } from "./Filters/FilterPanel/FilterPanel";
import { Footer } from "@/components/Footer/Footer";

interface Props {
  products: Product[];
}

export function CatalogPage({ products }: Props) {
  // Rango y categorías salen de los productos reales, no de valores fijos
  const priceCeiling = useMemo(
    () => Math.max(0, ...products.map((p) => Number(p.price) || 0)),
    [products],
  );
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      if (!p.category) continue;
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return [...counts].map(([name, count]) => ({ name, count }));
  }, [products]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  const closeMobile = useCallback(() => setMobileFilters(false), []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const visible = products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = (Number(product.price) || 0) <= maxPrice;
      const matchesSearch = !term || product.name.toLowerCase().includes(term);
      const matchesStock = !onlyInStock || !isOutOfStock(product);
      return matchesCategory && matchesPrice && matchesSearch && matchesStock;
    });

    return [...visible].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return 0;
    });
  }, [products, maxPrice, search, selectedCategories, sort, onlyInStock]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const activeFilters =
    selectedCategories.length + (maxPrice < priceCeiling ? 1 : 0) + (onlyInStock ? 1 : 0) + (search ? 1 : 0);

  const clear = () => {
    setSelectedCategories([]);
    setMaxPrice(priceCeiling);
    setOnlyInStock(false);
    setSearch("");
  };

  return (
    <main className="surface-light min-h-screen bg-foreground pt-20 text-background">
      <section className="px-6 pt-14 pb-24 md:px-[6vw] md:pt-20">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] leading-[.9] tracking-[-.06em]">
            Productos
            <span className="ml-3 align-top text-lg tracking-normal text-neutral-500 tabular-nums">
              {filteredProducts.length}
            </span>
          </h1>
          <Filters
            setMobileFilters={setMobileFilters}
            setSort={setSort}
            sort={sort}
            activeFilters={activeFilters}
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          <FilterPanel
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            maxPrice={maxPrice}
            priceCeiling={priceCeiling}
            setMaxPrice={setMaxPrice}
            onlyInStock={onlyInStock}
            setOnlyInStock={setOnlyInStock}
            search={search}
            setSearch={setSearch}
            clear={clear}
            canClear={activeFilters > 0}
            resultCount={filteredProducts.length}
            mobileOpen={mobileFilters}
            closeMobile={closeMobile}
          />

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 text-center">
              <p className="text-3xl tracking-[-0.04em]">No encontramos productos.</p>
              <p className="mt-2 text-neutral-600">Probá con otra búsqueda o quitá algún filtro.</p>
              <button
                type="button"
                onClick={clear}
                className="press mt-6 h-11 rounded-full bg-background px-5 text-sm font-medium text-foreground transition-[background-color,transform] duration-200 ease-out hover:bg-[#1a1a1a]"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
