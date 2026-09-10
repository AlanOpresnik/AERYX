import "server-only";
import {
  TiendanubeProduct,
  TiendanubeCategory,
  TiendanubeDraftOrder,
  TiendanubeDraftOrderProduct,
  TiendanubeOrder,
} from "./types";

const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;

class TiendanubeClient {
  private get baseUrl() {
    return `https://api.tiendanube.com/v1/${STORE_ID}`;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    if (!STORE_ID || !ACCESS_TOKEN) {
      throw new Error(
        "Tiendanube environment variables are not configured properly.",
      );
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    const headers = {
      Authentication: `bearer ${ACCESS_TOKEN}`,
      "User-Agent": "AERYX (info@aeryx.com.ar)",
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    };

    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        retries--;
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Tiendanube API Error ${response.status}: ${errorBody}`,
        );
      }

      return response.json();
    }

    throw new Error("Tiendanube API Rate limit exceeded after retries.");
  }

  public async getProducts(params?: {
    page?: number;
    per_page?: number;
    category_id?: number;
    q?: string;
    published?: boolean;
  }): Promise<TiendanubeProduct[]> {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined),
    );
    const query =
      Object.keys(cleanParams).length > 0
        ? "?" + new URLSearchParams(cleanParams as any).toString()
        : "";
    return this.request<TiendanubeProduct[]>(`/products${query}`, {
      next: { revalidate: 60, tags: ["tiendanube-products"] },
    });
  }

  public async getProductById(id: number): Promise<TiendanubeProduct> {
    return this.request<TiendanubeProduct>(`/products/${id}`, {
      next: { revalidate: 60, tags: ["tiendanube-products"] },
    });
  }

  public async getProductByHandle(
    handle: string,
  ): Promise<TiendanubeProduct | null> {
    const products = await this.getProducts({ handle } as any);
    const product = products.find((p) => {
      if (!p.handle) return false;
      const handleValue = typeof p.handle === "string" ? p.handle : p.handle.es;
      return handleValue === handle;
    });
    return product || null;
  }

  public async getCategories(params?: {
    page?: number;
    per_page?: number;
  }): Promise<TiendanubeCategory[]> {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined),
    );
    const query =
      Object.keys(cleanParams).length > 0
        ? "?" + new URLSearchParams(cleanParams as any).toString()
        : "";
    return this.request<TiendanubeCategory[]>(`/categories${query}`, {
      next: { revalidate: 300, tags: ["tiendanube-categories"] },
    });
  }

  public async getCategoryById(id: number): Promise<TiendanubeCategory> {
    return this.request<TiendanubeCategory>(`/categories/${id}`, {
      next: { revalidate: 300, tags: ["tiendanube-categories"] },
    });
  }

  public async createDraftOrder(data: {
    products: TiendanubeDraftOrderProduct[];
    contact_email?: string;
    contact_name?: string;
    contact_lastname?: string;
  }): Promise<TiendanubeDraftOrder> {
    return this.request<TiendanubeDraftOrder>("/draft_orders", {
      method: "POST",
      body: JSON.stringify(data),
      next: { revalidate: 0 }, // No cache for draft orders
    });
  }

  public async getOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
    created_at_min?: string;
    created_at_max?: string;
  }): Promise<TiendanubeOrder[]> {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined),
    );
    const query =
      Object.keys(cleanParams).length > 0
        ? "?" + new URLSearchParams(cleanParams as any).toString()
        : "";
    return this.request<TiendanubeOrder[]>(`/orders${query}`, {
      next: { revalidate: 0 },
    });
  }

  public async getOrderById(id: number): Promise<TiendanubeOrder> {
    return this.request<TiendanubeOrder>(`/orders/${id}`, {
      next: { revalidate: 0 },
    });
  }
}

export const tiendanube = new TiendanubeClient();
