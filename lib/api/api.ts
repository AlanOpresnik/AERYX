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

// Item que le mandamos al backend para que calcule peso/paquete del envío.
// weightKg/volumeM3 son opcionales: si no vienen, el backend usa un default.
export type ShippingItemInput = {
  weightKg?: number;
  volumeM3?: number;
  quantity: number;
};

// Una cotización individual devuelta por Enviopack (array crudo de
// /cotizar/precio/a-domicilio, ver GET /cotizar/precio/a-domicilio).
export type EnviopackQuote = {
  correo?: { id: string; nombre: string };
  despacho?: string;
  modalidad?: string;
  servicio?: string;
  valor: string;
  horas_entrega?: number;
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
        userId?: string | null;
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
    // AUTOCOMPLETE (sin cambios, sigue siendo GET)
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
          source?: string;
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
    //
    // Ahora es POST: el backend necesita el array `items` en el body
    // (peso/volumen del carrito) para pedirle una cotización precisa
    // a Enviopack cuando la dirección está lejos del depósito.
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
      items,
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

      items?: ShippingItemInput[];
    }) =>
      request<{
        success: boolean;

        decision: "near" | "enviopack";

        message: string;

        approximate: boolean;

        distanceKm: number;

        geocodingMethod: string | null;

        destination: {
          lat: number;
          lon: number;
          displayName: string | null;
        };

        address: {
          street: string;
          number: string;
          city: string;
          postalCode: string;
          province: string;
        };

        shipping: {
          id: string;
          title: string;
          description: string;

          price: number | null;

          estimatedDelivery: string;
        } | null;

        // Solo viene poblado cuando decision === "enviopack": el listado
        // completo de cotizaciones (no solo la más barata), por si querés
        // dejar que el comprador elija entre varias.
        enviopackQuotes: EnviopackQuote[] | null;
      }>("/api/shipping/evaluate", {
        method: "POST",
        body: JSON.stringify({
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
          items,
        }),
      }),
  },
};