export type TiendanubeI18nField = string | { es?: string; pt?: string; en?: string };

export interface TiendanubeVariant {
  id: number;
  product_id: number;
  sku: string | null;
  price: string;
  promotional_price: string | null;
  stock: number | null;
  stock_management: boolean;
  weight: string | null;
  width: string | null;
  height: string | null;
  depth: string | null;
  values: { es?: string; pt?: string; en?: string }[];
  created_at: string;
  updated_at: string;
  barcode: string | null;
}

export interface TiendanubeImage {
  id: number;
  product_id: number;
  src: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TiendanubeCategory {
  id: number;
  name: TiendanubeI18nField;
  description: TiendanubeI18nField;
  handle: TiendanubeI18nField;
  parent: number | null;
  subcategories: number[];
  created_at: string;
  updated_at: string;
}

export interface TiendanubeProduct {
  id: number;
  name: TiendanubeI18nField;
  description: TiendanubeI18nField;
  handle: TiendanubeI18nField;
  published: boolean;
  free_shipping: boolean;
  tags: string;
  created_at: string;
  updated_at: string;
  variants: TiendanubeVariant[];
  images: TiendanubeImage[];
  categories: TiendanubeCategory[] | number[];
  brand: string;
}

export interface TiendanubeProductCreate {
  name: { es: string };
  description: { es: string };
  handle: { es: string };
  tags: string;
  published: boolean;
  categories?: number[];
  attributes?: { es: string }[];
  variants: {
    price: string;
    promotional_price: string | null;
    stock: number | null;
    values?: { es: string }[];
  }[];
}

export interface TiendanubeDraftOrderProduct {
  variant_id: number;
  quantity: number;
}

export interface TiendanubeDraftOrder {
  id: number;
  token: string;
  status: string;
  payment_status: string;
  checkout_url: string;
  contact_email: string | null;
  contact_name: string | null;
  contact_lastname: string | null;
  total: string;
  products: any[];
  shipping_address: any | null;
}

export interface TiendanubeCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface TiendanubeShippingAddress {
  address: string;
  number: string;
  floor: string;
  locality: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface TiendanubeOrderProduct {
  product_id: number;
  variant_id: number;
  name: string;
  price: string;
  quantity: number;
  sku: string | null;
  image: { src: string };
}

export interface TiendanubeOrder {
  id: number;
  number: string;
  status: 'open' | 'closed' | 'cancelled';
  payment_status: string;
  shipping_status: string;
  token: string;
  customer: TiendanubeCustomer;
  shipping_address: TiendanubeShippingAddress;
  products: TiendanubeOrderProduct[];
  total: string;
  subtotal: string;
  shipping_cost_customer: string;
  shipping_cost_owner: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface TiendanubeWebhookEvent {
  store_id: number;
  event: string;
  id: number;
}

export interface TiendanubeApiError {
  code: number;
  message: string;
  description: string;
}

export interface TiendanubeStore {
  id: number;
  name: TiendanubeI18nField;
  original_domain: string;
  url_with_protocol: string;
  main_currency: string;
}

export interface TiendanubeCustomerFull {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  total_spent: string | null;
  total_spent_currency: string | null;
  last_order_id: number | null;
  active: boolean;
  accepts_marketing: boolean;
  created_at: string;
  default_address?: { city?: string; province?: string } | null;
}

/** Campos extra de una orden que usa el panel (la API devuelve muchos más). */
export interface TiendanubeOrderFull extends TiendanubeOrder {
  contact_email: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  gateway_name: string | null;
  shipping_option: string | null;
  shipping_tracking_number: string | null;
  shipping_tracking_url: string | null;
  discount: string | null;
  note: string | null;
  owner_note: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  closed_at: string | null;
  shipping_status: string;
  products: (TiendanubeOrderProduct & { variant_values?: string[] })[];
  shipping_address: TiendanubeShippingAddress & { name?: string; province?: string; floor?: string };
}
