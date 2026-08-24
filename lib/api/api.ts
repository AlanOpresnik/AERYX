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
    getAll: () => request<Product[]>("/api/products"),

    getById: (id: string) => request<Product>(`/api/products/${id}`),

create: (payload: Product | FormData) => {
  if (payload instanceof FormData) {
    return request<Product>("/api/products", {
      method: "POST",
      body: payload,
    });
  }

  return request<Product>("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
},

    update: (id: string, product: Partial<Product>) =>
      request<Product>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      }),

    delete: (id: string) =>
      request(`/api/products/${id}`, {
        method: "DELETE",
      }),

    validateCart: (cart: CartStorageItem[]) =>
      request<{
        success: boolean;
        data: {
          items: CheckoutItem[];
        };
        message?: string;
      }>("/api/cart/validate", {
        method: "POST",
        body: JSON.stringify({
          items: cart,
        }),
      }),
  },
  orders: {
    create: (data: {
      customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };

      shippingAddress: {
        address: string;
        addressNumber: string;
        betweenStreet1: string;
        betweenStreet2: string;
        city: string;
        postalCode: string;
        province: string;
        latitude: number | null;
        longitude: number | null;
        placeId: string | null;
        approximate: boolean;
      };

      shipping: {
        method: string | null;
        manual: boolean;

        option: {
          id: string;
          title: string;
          description: string;
          price: number;
        } | null;

        cost: number;
      };

      payment: {
        method: string;
      };

      items: {
        productId: string;
        quantity: number;
      }[];
    }) =>
      request<{
        success: boolean;
        message: string;

        order: {
          id: string;
          status: string;

          payment: {
            method: string;
            status: string;
            preferenceId?: string | null;
          };

          totals: {
            subtotal: number;
            shipping: number;
            total: number;
          };
        };

        mercadoPago?: {
          preferenceId: string;
          initPoint: string;
          sandboxInitPoint?: string;
        };
      }>("/api/mp/preference", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getAll: () => request<Order[]>("/api/orders/all"),
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
        }>("/api/orders/metric"),
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

  shipping: {
    // =====================================================
    // AUTOCOMPLETE
    // =====================================================

    autocomplete: (
      address: string,
      addressNumber: string,
      city: string,
      postalCode: string,
    ) =>
      request<{
        success: boolean;

        results: {
          id: string;

          // Nominatim devuelve un placeId numérico.
          // Georef (usado como fallback de altura) no
          // tiene ese concepto, así que puede venir null.
          placeId: number | null;

          osmType: string | null;
          osmId: number | null;

          address: string;
          addressNumber: string;
          fullAddress: string;

          city: string;
          province: string;
          postalCode: string;

          lat: number;
          lon: number;

          importance: number;
          type: string | null;

          // De dónde salió el resultado: nominatim,
          // georef, o una variante *_street_level cuando
          // no se encontró la altura exacta.
          source?: string;

          // true cuando no se encontró la altura exacta
          // en ninguna fuente y el punto corresponde solo
          // a la calle (aproximado).
          approximate?: boolean;
        }[];
      }>(
        `/api/shipping/autocomplete?` +
          `address=${encodeURIComponent(address)}` +
          `&address_number=${encodeURIComponent(addressNumber)}` +
          `&city=${encodeURIComponent(city)}` +
          `&postal_code=${encodeURIComponent(postalCode)}`,
      ),

    // =====================================================
    // EVALUAR ENVÍO
    // =====================================================

    evaluate: ({
      address,
      addressNumber,
      betweenStreet1,
      betweenStreet2,
      city,
      postalCode,
      province,
      latitude,
      longitude,
      placeId,
      approximate,
    }: {
      address: string;
      addressNumber: string;

      betweenStreet1?: string;
      betweenStreet2?: string;

      city: string;
      postalCode: string;
      province?: string;

      latitude?: number | null;
      longitude?: number | null;

      placeId?: number | string | null;

      approximate?: boolean;
    }) => {
      const params = new URLSearchParams();

      params.set("address", address);
      params.set("address_number", addressNumber);

      params.set("between_street_1", betweenStreet1 || "");

      params.set("between_street_2", betweenStreet2 || "");

      params.set("city", city);
      params.set("postal_code", postalCode);

      if (province) {
        params.set("province", province);
      }

      if (latitude !== null && latitude !== undefined) {
        params.set("latitude", String(latitude));
      }

      if (longitude !== null && longitude !== undefined) {
        params.set("longitude", String(longitude));
      }

      if (placeId !== null && placeId !== undefined) {
        params.set("place_id", String(placeId));
      }

      if (approximate) {
        params.set("approximate", "true");
      }

      return request<{
        success: boolean;

        decision: string;

        message: string;

        approximate: boolean;

        distanceKm: number;

        geocodingMethod: string;

        origin: {
          lat: number;
          lon: number;
        };

        destination: {
          lat: number;
          lon: number;
          displayName: string | null;
        };

        address: {
          street: string;
          number: string;

          betweenStreet1: string | null;
          betweenStreet2: string | null;

          city: string;
          postalCode: string;
          province: string;

          placeId: string | null;
        };

        shipping: {
          id: string;
          title: string;
          description: string;

          price: number | null;

          estimatedDelivery: string;
        } | null;

        record: unknown;
      }>(`/api/shipping/evaluate?${params.toString()}`);
    },
  },
};
