"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/api/api";
import {
  CartStorageItem,
  CheckoutItem,
} from "@/lib/interface/cart";

type CartContextType = {
  cart: CartStorageItem[];
  cartCount: number;
  loading: boolean;

  addToCart: (item: CartStorageItem) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;

  validateCart: (
    cart: CartStorageItem[]
  ) => Promise<CheckoutItem[]>;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const CART_KEY = "cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartStorageItem[]>([]);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // CARGAR CARRITO
  // =====================================================

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

  // =====================================================
  // PERSISTIR CARRITO
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  // =====================================================
  // VALIDAR CARRITO
  // =====================================================

  const validateCart = useCallback(
    async (cartToValidate: CartStorageItem[]) => {
      const response = await api.products.validateCart(
        cartToValidate
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "No se pudo validar el carrito"
        );
      }

      return response.data.items;
    },
    []
  );

  // =====================================================
  // AGREGAR
  // =====================================================

  const addToCart = useCallback(
    async (item: CartStorageItem) => {
      setLoading(true);

      try {
        const existingItem = cart.find(
          (cartItem) =>
            cartItem.productId === item.productId
        );

        let newCart: CartStorageItem[];

        if (existingItem) {
          newCart = cart.map((cartItem) =>
            cartItem.productId === item.productId
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity + item.quantity,
                }
              : cartItem
          );
        } else {
          newCart = [...cart, item];
        }

        // Validamos ANTES de guardar
        await validateCart(newCart);

        setCart(newCart);
      } finally {
        setLoading(false);
      }
    },
    [cart, validateCart]
  );

  // =====================================================
  // CAMBIAR CANTIDAD
  // =====================================================

  const updateQuantity = useCallback(
    async (
      productId: string,
      quantity: number
    ) => {
      // Si llega a 0 o menos → eliminar
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      setLoading(true);

      try {
        const newCart = cart.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity,
              }
            : item
        );

        await validateCart(newCart);

        setCart(newCart);
      } finally {
        setLoading(false);
      }
    },
    [cart, validateCart]
  );

  // =====================================================
  // ELIMINAR
  // =====================================================

  const removeFromCart = useCallback(
    async (productId: string) => {
      setLoading(true);

      try {
        const newCart = cart.filter(
          (item) =>
            item.productId !== productId
        );

        setCart(newCart);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  // =====================================================
  // VACIAR
  // =====================================================

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  // =====================================================
  // CANTIDAD TOTAL
  // =====================================================

  const cartCount = cart.length

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
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
}