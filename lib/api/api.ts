import { CartStorageItem, CheckoutItem } from "@/lib/interface/cart";

import { Product } from "../interface/ProductInterface";
import { Order } from "../interface/Order";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Mismo shape que el subdocumento `address` de tu modelo User.
export type UserAddress = {
  address: string;
  addressNumber: string;
  betweenStreet1: string;
  betweenStreet2: string;
  floorApt: string;
  city: string;
  postalCode: string;
  province: string;
};

export async function request<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string | null,
): Promise<T | null> {
  try {
    const headers = {
      ...options?.headers,
    } as Record<string, string>;

    if (!(options?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      console.error(`API Error ${res.status}: ${endpoint}`);

      return null;
    }

    return await res.json();
  } catch (error) {
    console.log(`API connection error: ${endpoint}`, error);

    return null;
  }
}

export const api = {
  products: {
    getAll: (params?: { category_id?: number; q?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category_id) searchParams.set('category_id', String(params.category_id));
      if (params?.q) searchParams.set('q', params.q);
      const qs = searchParams.toString();
      return request<Product[]>(`/api/tiendanube/products${qs ? `?${qs}` : ''}`);
    },

    getById: (id: string) => request<Product>(`/api/tiendanube/products/${id}`),

    validateCart: (cart: CartStorageItem[]) =>
      request<{
        success: boolean;
        data: { items: CheckoutItem[] };
        message?: string;
      }>("/api/tiendanube/cart/validate", {
        method: "POST",
        body: JSON.stringify({ items: cart }),
      }),
  },
  orders: {
    create: (data: {
      items: { variantId: number; quantity: number }[];
      contactEmail?: string;
      contactName?: string;
      contactLastname?: string;
    }) =>
      request<{
        success: boolean;
        checkoutUrl: string;
      }>("/api/tiendanube/checkout", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getAll: () => request<Order[]>("/api/tiendanube/orders"),
    getById: (id: string) => request<Order>("/api/tiendanube/orders/" + id),
    dashboard: {
      getMetrics: () =>
        request<{
          success: boolean;
          metrics: {
            netSales: number;
            orders: number;
            averageTicket: number;
            totalOrders: number;
          };
        }>("/api/tiendanube/orders/metrics"),
    },
  },

  users: {
    sync: (
      data: {
        email: string;
        firstName: string;
        lastName: string;
        username: string | null;
        imageUrl: string | null;
      },
      token?: string | null,
    ) =>
      request<{
        success: boolean;
        created: boolean;
        user: {
          _id: string;
          clerkId: string;
          username: string | null;
          email: string;
          firstName: string;
          lastName: string;
          imageUrl: string | null;
        };
      }>(
        "/api/users/sync",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token,
      ),

    getMe: (token?: string | null) =>
      request<{
        success: boolean;
        user: {
          _id: string;
          clerkId: string;
          username: string | null;
          email: string;
          firstName: string;
          lastName: string;
          imageUrl: string | null;
          phone: string;
          address: UserAddress | null;
        };
      }>("/api/users/me", undefined, token),

    // =====================================================
    // ACTUALIZAR DATOS DEL USUARIO
    // =====================================================
    update: (
      data: {
        firstName: string;
        lastName: string;
        phone: string;
        address: UserAddress;
      },
      token?: string | null,
    ) =>
      request<{
        success: boolean;
        user: {
          _id: string;
          clerkId: string;
          username: string | null;
          email: string;
          firstName: string;
          lastName: string;
          imageUrl: string | null;
          phone: string;
          address: UserAddress;
        };
      }>(
        "/api/users/update",
        {
          method: "PATCH",
          body: JSON.stringify(data),
        },
        token,
      ),
  },
};