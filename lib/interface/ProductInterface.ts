export type ImagePreview = { id: string; name: string; url: string; file?: File };

export interface ProductSpecs {
  [key: string]: string;
}

export interface ProductVariant {
  id: number;
  sku: string | null;
  price: number;
  promotionalPrice: number | null;
  stock: number | null;
  values: { name: string; value: string }[];
  weight: string | null;
  width: string | null;
  height: string | null;
  depth: string | null;
}

export interface Product {
  _id: string;
  slug: string;
  tag: string;
  name: string;
  category: string;
  aeryx_drop: string;
  price: number;
  originalPrice: number;
  images: string[];
  publicity_image: string;
  descriptionSetUp: string[];
  position: string;
  description: string;
  features: string[];
  isNew: boolean;
  inDiscount: boolean;
  type: string;
  sizes: string[];
  stock: number;
  specs: ProductSpecs;
  created_at: string;
  __v: number;
  /** Tiendanube variants — available when fetched from Tiendanube */
  variants?: ProductVariant[];
}