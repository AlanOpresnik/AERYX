"use client";
import ProductCard from "@/components/Shop/ProductCard/ProductCard";
import { api } from "@/lib/api/api";
import { Product } from "@/lib/interface/ProductInterface";
import { useEffect, useMemo, useState } from "react";
import Filters from "./Filters/Filters";
import { FilterPanel } from "./Filters/FilterPanel/FilterPanel";
import { Footer } from "@/components/Footer/Footer";

interface Props {
    products: Product[]
}

export function CatalogPage({products}:Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const filteredProducts = useMemo(() => {
    const visible = products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesPrice = product.price <= maxPrice;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });

    return [...visible].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;

      return 0;
    });
  }, [products, maxPrice, search, selectedCategories, sort]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <main className="min-h-screen pt-32 bg-[#f4f4f1] text-[#101010]">
      <section id="productos" className=" px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="eyebrow mb-2">Tienda</p>
              <h2 className="font-display text-4xl tracking-[-0.07em] sm:text-5xl">
                Todos los productos{" "}
                <span className="text-base align-middle font-sans tracking-normal text-black/35">
                  ({filteredProducts.length})
                </span>
              </h2>
            </div>
            <Filters
              setMobileFilters={setMobileFilters}
              setSort={setSort}
              sort={sort}
            />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[210px_1fr]">
            <FilterPanel
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              search={search}
              setSearch={setSearch}
              clear={() => {
                setSelectedCategories([]);
                setMaxPrice(99990);
                setSearch("");
              }}
              mobileOpen={mobileFilters}
              closeMobile={() => setMobileFilters(false)}
            />
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-x-4 gap-y-9 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid grid-cols-1 gap-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full align-middle items-center py-42   text-center">
                  <p className="font-display text-3xl tracking-[-0.05em]">
                    No encontramos productos.
                  </p>
                  <button
                    className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] underline"
                    onClick={() => {
                      setSelectedCategories([]);
                      setMaxPrice(300);
                      setSearch("");
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
