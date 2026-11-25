import "server-only";
import {
  TiendanubeProduct,
  TiendanubeCategory,
  TiendanubeDraftOrder,
  TiendanubeDraftOrderProduct,
  TiendanubeOrder,
  TiendanubeImage,
  TiendanubeProductCreate,
  TiendanubeStore,
  TiendanubeCustomerFull,
  TiendanubeOrderFull,
  TiendanubeVariant,
} from "./types";

const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;

class TiendanubeClient {
  private get baseUrl() {
    return `https://api.tiendanube.com/v1/${STORE_ID}`;
  }

  private async send(endpoint: string, options?: RequestInit): Promise<Response> {
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
        delay *= 2;
        retries--;
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Tiendanube API Error ${response.status}: ${errorBody}`,
        );
      }

      return response;
    }

    throw new Error("Tiendanube API Rate limit exceeded after retries.");
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return (await this.send(endpoint, options)).json();
  }

  /** Igual que request, pero también devuelve el total de resultados (para paginar). */
  private async requestPage<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<{ items: T[]; total: number }> {
    try {
      const response = await this.send(endpoint, options);
      const items = (await response.json()) as T[];
      const total = Number(response.headers.get("x-total-count"));
      return { items, total: Number.isFinite(total) ? total : items.length };
    } catch (error) {
      // Tiendanube responde 404 cuando una página filtrada no tiene resultados
      if (error instanceof Error && /Error 404/.test(error.message)) {
        return { items: [], total: 0 };
      }
      throw error;
    }
  }

  private query(params?: Record<string, unknown>): string {
    const clean = Object.fromEntries(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)]),
    );
    return Object.keys(clean).length ? "?" + new URLSearchParams(clean) : "";
  }

  // ---- Lectura para el panel de administración (sin caché) ----

  public async getStore(): Promise<TiendanubeStore> {
    return this.request<TiendanubeStore>(
      "/store?fields=id,name,original_domain,url_with_protocol,main_currency",
      { next: { revalidate: 3600 } },
    );
  }

  public async getOrdersPage(params: {
    page?: number;
    per_page?: number;
    q?: string;
    status?: string;
    payment_status?: string;
    shipping_status?: string;
    created_at_min?: string;
    customer_ids?: number;
  }) {
    return this.requestPage<TiendanubeOrderFull>(`/orders${this.query(params)}`, {
      cache: "no-store",
    });
  }

  public async getCustomersPage(params: { page?: number; per_page?: number; q?: string }) {
    return this.requestPage<TiendanubeCustomerFull>(
      `/customers${this.query(params)}`,
      { cache: "no-store" },
    );
  }

  public async getAllProductsForAdmin(): Promise<TiendanubeProduct[]> {
    // Incluye los productos sin publicar
    return this.request<TiendanubeProduct[]>("/products?per_page=200", {
      cache: "no-store",
    });
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

  // ---- Escritura de productos (requiere el permiso write_products) ----

  public async createProduct(data: TiendanubeProductCreate): Promise<TiendanubeProduct> {
    return this.request<TiendanubeProduct>("/products", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });
  }

  public async updateProduct(
    id: number,
    data: Partial<Pick<TiendanubeProductCreate, "published" | "name" | "description" | "tags">>,
  ): Promise<TiendanubeProduct> {
    return this.request<TiendanubeProduct>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      cache: "no-store",
    });
  }

  public async addProductImage(
    productId: number,
    image: { attachment: string; filename: string; position: number },
  ): Promise<TiendanubeImage> {
    return this.request<TiendanubeImage>(`/products/${productId}/images`, {
      method: "POST",
      body: JSON.stringify(image),
      cache: "no-store",
    });
  }

  /** Stock de una variante. null = sin control de stock (ilimitado). */
  public async updateVariantStock(productId: number, variantId: number, stock: number | null) {
    return this.request<TiendanubeVariant>(`/products/${productId}/variants/${variantId}`, {
      method: "PUT",
      body: JSON.stringify({ stock }),
      cache: "no-store",
    });
  }

  public async createCategory(name: string): Promise<TiendanubeCategory> {
    return this.request<TiendanubeCategory>("/categories", {
      method: "POST",
      body: JSON.stringify({ name: { es: name } }),
      cache: "no-store",
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

  /** Pedido sin pagar: trae el link para retomar el pago. */
  public async getDraftOrder(id: number): Promise<TiendanubeDraftOrder & { abandoned_checkout_url?: string }> {
    return this.request(`/draft_orders/${id}`, { cache: "no-store" });
  }

  public async getOrderById(id: number): Promise<TiendanubeOrder> {
    return this.request<TiendanubeOrder>(`/orders/${id}`, {
      next: { revalidate: 0 },
    });
  }
}

export const tiendanube = new TiendanubeClient();
