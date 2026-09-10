"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { CartStorageItem, CheckoutItem } from "@/lib/interface/cart";

type CartContextType = {
  cart: CartStorageItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (item: CartStorageItem) => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  removeFromCart: (variantId: number) => Promise<void>;
  clearCart: () => void;
  validateCart: (cart: CartStorageItem[]) => Promise<CheckoutItem[]>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartStorageItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setCart(parsed);
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
      localStorage.removeItem(CART_KEY);
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Validate cart against Tiendanube
  const validateCart = useCallback(
    async (cartToValidate: CartStorageItem[]): Promise<CheckoutItem[]> => {
      const res = await fetch("/api/tiendanube/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartToValidate }),
      });

      if (!res.ok) {
        throw new Error("No se pudo validar el carrito");
      }

      const data = await res.json();
      if (!data?.success) {
        throw new Error(data?.message || "No se pudo validar el carrito");
      }

      return data.data.items;
    },
    [],
  );

  // Add to cart
  const addToCart = useCallback(
    async (item: CartStorageItem) => {
      setLoading(true);
      try {
        const existingItem = cart.find(
          (cartItem) => cartItem.variantId === item.variantId,
        );

        let newCart: CartStorageItem[];

        if (existingItem) {
          newCart = cart.map((cartItem) =>
            cartItem.variantId === item.variantId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem,
          );
        } else {
          newCart = [...cart, item];
        }

        // Validate before saving
        await validateCart(newCart);
        setCart(newCart);
      } finally {
        setLoading(false);
      }
    },
    [cart, validateCart],
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (variantId: number, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(variantId);
        return;
      }

      setLoading(true);
      try {
        const newCart = cart.map((item) =>
          item.variantId === variantId ? { ...item, quantity } : item,
        );

        await validateCart(newCart);
        setCart(newCart);
      } finally {
        setLoading(false);
      }
    },
    [cart, validateCart],
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (variantId: number) => {
      setLoading(true);
      try {
        const newCart = cart.filter((item) => item.variantId !== variantId);
        setCart(newCart);
      } finally {
        setLoading(false);
      }
    },
    [cart],
  );

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  // Total item count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider");
  }
  return context;
}