"use client";

import { useRouter } from "next/navigation";

export function RefreshButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="mt-8 bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a]"
    >
      Reintentar
    </button>
  );
}