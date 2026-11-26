"use client";

import { mono, pagePad } from "@/lib/products-mock-data";
import {
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/context/cartContext";
import { CartSidebar } from "./CartSidebar";
import { useClerk, useUser } from "@clerk/nextjs";
import Avatar from "./UserMenu/Avatar";
import { UserMenu } from "./UserMenu/Menu/Menu";
import { SUPERADMIN_EMAIL } from "@/lib/auth/constants";

export function Header() {
  const { cartCount, isCartOpen, openCart, closeCart } = useCart();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const { signOut } = useClerk();
  const { user } = useUser();

  // =====================================================
  // CLICK AFUERA
  // =====================================================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // =====================================================
  // ESC
  // =====================================================

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);

    await signOut({
      redirectUrl: "/",
    });
  };

  return (
    <>
      <header
        className={`site-header absolute inset-x-0 top-0 !z-50 flex h-20 items-center justify-between border-b border-border !bg-black ${pagePad}`}
      >
        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <Link
          href="/"
          className={`${mono} flex items-center gap-3 text-foreground text-2xl font-semibold tracking-[-.02em]`}
          aria-label="Inicio de Aeryx"
        >
          <span className="text-2xl font-semibold">AERYX</span>
        </Link>

        {/* ================================================= */}
        {/* NAV */}
        {/* ================================================= */}

        <nav
          className={`${mono} hidden gap-10 text-muted-foreground md:flex`}
          aria-label="Navegación principal"
        >
          <Link
            className="transition-colors hover:text-foreground"
            href="/catalog"
          >
            Productos
          </Link>

          <Link
            className="transition-colors hover:text-foreground"
            href="/#categorias"
          >
            Categorías
          </Link>

          <Link
            className="transition-colors hover:text-foreground"
            href="/#marca"
          >
            Nosotros
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={openCart}
            className={`${mono} press flex items-center gap-2 transition-colors duration-200 hover:text-foreground/80`}
            aria-label={`Abrir carrito (${cartCount} productos)`}
          >
            <ShoppingBag className="size-4" />

            <span className="hidden sm:inline">
              Tienda
            </span>

            <span className="grid size-6 place-items-center rounded-full bg-foreground text-background tabular-nums">
              {cartCount}
            </span>
          </button>

          <div
            ref={userMenuRef}
            className="relative"
          >


            <button
              type="button"
              onClick={() =>
                setIsUserMenuOpen(
                  (previous) => !previous,
                )
              }
              className="group flex items-center gap-2"
              aria-label="Abrir menú de usuario"
              aria-expanded={isUserMenuOpen}
            >
              <Avatar user={user} />

              <ChevronDown
                className={`hidden size-4 text-white/50 transition-transform duration-200 ease-out sm:block ${
                  isUserMenuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>



            <div
              className={`absolute right-0 top-[calc(100%+12px)] z-[100] w-64 origin-top-right transition-[opacity,transform] duration-200 ease-out ${
                isUserMenuOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
              }`}
            >
              {/* USER INFO */}

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl shadow-black/50 backdrop-blur-xl">

                <div className="border-b border-white/10 px-4 py-4">
                  <p
                    className={`${mono} truncate text-sm font-medium text-white`}
                  >
                    {user?.fullName ||
                      user?.username ||
                      "Mi cuenta"}
                  </p>

                  <p
                    className={`${mono} mt-1 truncate text-xs text-white/40`}
                  >
                    {user?.primaryEmailAddress
                      ?.emailAddress || ""}
                  </p>
                </div>

                {/* ================================================= */}
                {/* MENU */}
                {/* ================================================= */}

                <UserMenu
                  onClose={() =>
                    setIsUserMenuOpen(false)
                  }
                  onSignOut={handleSignOut}
                  // Solo muestra el acceso; el permiso real se valida en el servidor
                  isAdmin={Boolean(
                    user?.emailAddresses.some(
                      (e) =>
                        e.emailAddress.toLowerCase() === SUPERADMIN_EMAIL &&
                        e.verification?.status === "verified",
                    ),
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* CART */}
      {/* ================================================= */}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={closeCart}
      />
    </>
  );
}