"use client";

import {
  ArrowDownUp,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";

function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-black/[0.08] ${className}`}
    />
  );
}

/* =========================================================
   FILTERS
========================================================= */

function FilterSkeleton() {
  return (
    <aside className="hidden lg:block">
      {/* Search */}
      <div className="relative mb-9">
        <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-black/20" />

        <SkeletonBlock className="h-10 w-full border-b border-black/10 bg-transparent" />
      </div>

      {/* Tipo de producto */}
      <div className="mb-9">
        <SkeletonBlock className="mb-4 h-3 w-32" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <SkeletonBlock className="h-4 w-4" />

                {/* Nombre */}
                <SkeletonBlock
                  className={`h-3 ${
                    index === 0
                      ? "w-12"
                      : index === 1
                        ? "w-20"
                        : "w-16"
                  }`}
                />
              </div>

              {/* Cantidad */}
              <SkeletonBlock className="h-3 w-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="mb-9">
        <SkeletonBlock className="mb-4 h-3 w-28" />

        <div className="mb-4 flex items-center justify-between">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-3 w-12" />
        </div>

        {/* Slider */}
        <div className="relative py-1">
          <SkeletonBlock className="h-1 w-full rounded-full" />

          <SkeletonBlock className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" />
        </div>

        <div className="mt-3 flex justify-between">
          <SkeletonBlock className="h-3 w-8" />
          <SkeletonBlock className="h-3 w-10" />
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="mb-8">
        <SkeletonBlock className="mb-4 h-3 w-28" />

        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-4 w-4" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>

      {/* Limpiar filtros */}
      <SkeletonBlock className="h-3 w-28" />
    </aside>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Imagen */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/[0.08]">
        {/* Badge */}
        <SkeletonBlock className="absolute left-3 top-3 h-6 w-20 rounded-full" />

        {/* Heart */}
        <SkeletonBlock className="absolute right-3 top-3 h-8 w-8 rounded-full" />
      </div>

      {/* Información */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Nombre */}
          <SkeletonBlock className="h-5 w-32" />

          {/* Descripción */}
          <SkeletonBlock className="mt-2 h-3 w-40" />
        </div>

        {/* Precio */}
        <SkeletonBlock className="h-5 w-16" />
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT GRID
========================================================= */

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/* =========================================================
   MAIN SKELETON
========================================================= */

export default function CatalogSkeletonGrid() {
  return (
    <main className="min-h-screen bg-[#f4f4f1] text-[#101010] pt-32">
      <section className="border-t border-black/15 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1440px]">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            {/* Título */}
            <div>
              {/* TIENDA */}
              <SkeletonBlock className="mb-3 h-3 w-12" />

              <div className="flex items-end gap-2">
                {/* TODOS LOS PRODUCTOS */}
                <SkeletonBlock className="h-12 w-[270px] sm:h-14 sm:w-[330px]" />

                {/* Cantidad */}
                <SkeletonBlock className="mb-2 h-4 w-8" />
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2">

              {/* Mobile filters */}
              <SkeletonBlock className="h-11 w-24 md:hidden" />

              {/* Ordenar */}
              <div className="flex h-11 w-[158px] items-center gap-2 border border-black/10 px-3">
                <ArrowDownUp className="h-4 w-4 text-black/15" />

                <SkeletonBlock className="h-3 w-20" />

                <SkeletonBlock className="ml-auto h-2 w-2 rounded-full" />
              </div>

              {/* Grid / List */}
           
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[210px_1fr]">

            {/* Sidebar */}
            <FilterSkeleton />

            {/* Productos */}
            <ProductsGridSkeleton />

          </div>
        </div>
      </section>
    </main>
  );
}