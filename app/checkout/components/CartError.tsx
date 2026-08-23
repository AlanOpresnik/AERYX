import React from "react";

interface Props {
  onBack: () => void;
  cartError: string;
}

export default function CartError({ onBack,cartError }: Props) {
  return (
    <main className="min-h-screen mt-32 bg-[#f4f4f1] text-[#101010]">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-12 lg:pt-16">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.17em] text-red-500">
            Error
          </p>

          <p className="max-w-md text-sm text-black/55">{cartError}</p>

          <button
            onClick={onBack}
            className="mt-6 bg-black px-8 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a]"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </main>
  );
}
