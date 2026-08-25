import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
interface Props{

  mounted:boolean
}
export default function ActionsButtons({mounted}:Props) {
  return (
    <div
      className={`mx-auto mt-10 flex w-full max-w-[1200px] flex-col justify-center gap-3 transition-all duration-700 delay-700 sm:flex-row print:hidden ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Link
        href="/"
        className="flex items-center justify-center gap-2 border border-black/25 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.18em] transition hover:bg-black/5"
      >
        Seguir comprando
      </Link>

      <Link
        href="/perfil/pedidos"
        className="group flex items-center justify-center !text-white gap-3 bg-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1a1a1a]"
      >
        Ver mis pedidos
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </Link>
    </div>
  );
}
