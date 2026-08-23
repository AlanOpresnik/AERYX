import React from "react";

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <header className="h-[76px] border-b border-white/10 bg-black">
        <div className="mx-auto flex h-full items-center justify-between px-5 md:px-12 lg:px-24">
          {/* Logo */}
          <div className="h-5 w-24 animate-pulse rounded bg-white/10" />

          {/* Navigation */}
          <nav className="hidden items-center gap-12 md:flex">
            <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="hidden h-4 w-20 animate-pulse rounded bg-white/10 sm:block" />

            <div className="h-6 w-6 animate-pulse rounded-full bg-white/10" />

            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />

            <div className="h-3 w-3 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      </header>

      {/* PRODUCT */}
      <main className="grid min-h-[calc(100vh-76px)] grid-cols-1 lg:grid-cols-[54%_46%]">
        {/* LEFT / GALLERY */}
        <section className="relative border-b border-white/10 lg:border-b-0 lg:border-r">
          {/* Badge */}
          <div className="absolute left-5 top-5 z-10 h-8 w-32 animate-pulse rounded-full bg-white/10" />

          {/* Main image */}
          <div className="flex min-h-[520px] items-center justify-center bg-[#090909] p-6 md:p-10 lg:min-h-[calc(100vh-76px)]">
            <div className="aspect-[49/42] w-full max-w-[750px] animate-pulse rounded-[4px] bg-white/[0.06]" />
          </div>

          {/* Gallery counter */}
          <div className="absolute bottom-5 right-6">
            <div className="h-3 w-12 animate-pulse rounded bg-white/10" />
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-0 left-0 flex translate-y-full gap-2 bg-black p-3 lg:translate-y-0">
            <div className="h-20 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-20 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-20 w-24 animate-pulse rounded bg-white/10" />
          </div>
        </section>

        {/* RIGHT / PRODUCT INFO */}
        <section className="flex flex-col px-6 py-12 md:px-12 lg:px-14 xl:px-16">
          {/* Top metadata */}
          <div className="mb-8 flex items-center justify-between gap-6">
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-64 animate-pulse rounded bg-white/10" />
          </div>

          {/* Product type */}
          <div className="mb-6 h-3 w-32 animate-pulse rounded bg-white/10" />

          {/* Title */}
          <div className="space-y-3">
            <div className="h-16 w-[85%] animate-pulse rounded bg-white/10" />
            <div className="h-16 w-[75%] animate-pulse rounded bg-white/10" />
            <div className="h-16 w-[90%] animate-pulse rounded bg-white/10" />
          </div>

          {/* Description */}
          <div className="mt-8 space-y-2">
            <div className="h-4 w-[75%] animate-pulse rounded bg-white/10" />
            <div className="h-4 w-[55%] animate-pulse rounded bg-white/10" />
          </div>

          {/* Price */}
          <div className="mt-12 border-b border-white/10 pb-6">
            <div className="mb-3 h-3 w-20 animate-pulse rounded bg-white/10" />

            <div className="flex justify-between">
              <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
              <div className="h-9 w-32 animate-pulse rounded bg-white/10" />
            </div>
          </div>

          {/* Size */}
          <div className="mt-10">
            <div className="mb-4 h-3 w-28 animate-pulse rounded bg-white/10" />

            <div className="h-20 w-56 animate-pulse rounded-lg bg-white/10" />
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-5 flex gap-3">
            <div className="flex h-14 w-32 animate-pulse items-center justify-between rounded-lg border border-white/10 px-4">
              <div className="h-4 w-4 rounded bg-white/10" />
              <div className="h-4 w-4 rounded bg-white/10" />
              <div className="h-4 w-4 rounded bg-white/10" />
            </div>

            <div className="h-14 flex-1 animate-pulse rounded-lg bg-white/10" />
          </div>

          {/* Stock */}
          <div className="mt-4 h-3 w-48 animate-pulse rounded bg-white/10" />
        </section>
      </main>
    </div>
  );
}