"use client";

import Link from "next/link";
import { User, Package, Settings, LogOut } from "lucide-react";

import { mono } from "@/lib/products-mock-data";

interface UserMenuProps {
  onClose: () => void;
  onSignOut: () => void;
}

export function UserMenu({ onClose, onSignOut }: UserMenuProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
      {/* ================================================= */}
      {/* MENU */}
      {/* ================================================= */}

      <div className="p-2">
        {/* PERFIL */}

        <Link
          href="/profile"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/10"
        >
          <User className="size-4 text-white/50 transition-colors group-hover:text-white" />

          <span
            className={`${mono} text-sm text-white/70 transition-colors group-hover:text-white`}
          >
            Mi perfil
          </span>
        </Link>

        {/* PEDIDOS */}

        <Link
          href="/profile"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/10"
        >
          <Package className="size-4 text-white/50 transition-colors group-hover:text-white" />

          <span
            className={`${mono} text-sm text-white/70 transition-colors group-hover:text-white`}
          >
            Pedidos recientes
          </span>
        </Link>

        {/* CONFIGURACIÓN */}

        <Link
          href="/profile/edit"
          onClick={onClose}
          className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/10"
        >
          <Settings className="size-4 text-white/50 transition-colors group-hover:text-white" />

          <span
            className={`${mono} text-sm text-white/70 transition-colors group-hover:text-white`}
          >
            Configuración
          </span>
        </Link>
      </div>

      {/* ================================================= */}
      {/* LOGOUT */}
      {/* ================================================= */}

      <div className="border-t border-white/10 p-2">
        <button
          type="button"
          onClick={onSignOut}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-red-500/10"
        >
          <LogOut className="size-4 text-white/40 transition-colors group-hover:text-red-400" />

          <span
            className={`${mono} text-sm text-white/60 transition-colors group-hover:text-red-400`}
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </div>
  );
}
