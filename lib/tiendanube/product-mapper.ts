import { TiendanubeProduct, TiendanubeVariant, TiendanubeI18nField } from './types';

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
  variants: ProductVariant[];
  /** Slugs de productos que combinan con este (tags combina:<slug>) */
  pairsWith: string[];
}

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
};

export function getI18nValue(field: TiendanubeI18nField | undefined, lang = 'es'): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang as keyof typeof field] || Object.values(field)[0] || '';
}

export function parseDescriptionContent(htmlOrText: string): { description: string; specs: ProductSpecs; features: string[]; descriptionSetUp: string[] } {
  const content = htmlOrText || '';
  const result = {
    description: '',
    specs: {} as ProductSpecs,
    features: [] as string[],
    descriptionSetUp: [] as string[]
  };

  const specsIndex = content.indexOf('---SPECS---');
  const featuresIndex = content.indexOf('---FEATURES---');
  const setupIndex = content.indexOf('---SETUP---');

  if (specsIndex === -1 && featuresIndex === -1 && setupIndex === -1) {
    result.description = stripHtml(content);
    return result;
  }

  const getSub = (startIdx: number, nextDelimiter: string) => {
    if (startIdx === -1) return '';
    const startStr = content.substring(startIdx + nextDelimiter.length);
    const endIndicators = ['---SPECS---', '---FEATURES---', '---SETUP---'].filter(d => d !== nextDelimiter);
    
    let earliestEnd = startStr.length;
    for (const d of endIndicators) {
      const idx = startStr.indexOf(d);
      if (idx !== -1 && idx < earliestEnd) earliestEnd = idx;
    }
    return startStr.substring(0, earliestEnd);
  };

  // La descripción termina en el primer bloque, sea cual sea
  const firstMarker = Math.min(
    ...[specsIndex, featuresIndex, setupIndex].filter((i) => i !== -1),
  );
  result.description = stripHtml(content.substring(0, firstMarker));

  if (specsIndex !== -1) {
    const specsRaw = stripHtml(getSub(specsIndex, '---SPECS---'));
    specsRaw.split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val.length > 0) {
        result.specs[key.trim()] = val.join(':').trim();
      }
    });
  }

  if (featuresIndex !== -1) {
    const featuresRaw = stripHtml(getSub(featuresIndex, '---FEATURES---'));
    result.features = featuresRaw.split('\n').map(l => l.replace(/^-/, '').trim()).filter(Boolean);
  }

  if (setupIndex !== -1) {
    const setupRaw = stripHtml(getSub(setupIndex, '---SETUP---'));
    result.descriptionSetUp = setupRaw.split('\n').map(l => l.replace(/^-/, '').trim()).filter(Boolean);
  }

  return result;
}

export function parseTagsMetadata(tags: string): { tag: string; type: string; aeryxDrop: string; isNew: boolean; inDiscount: boolean; pairsWith: string[] } {
  const result = { tag: '', type: '', aeryxDrop: '', isNew: false, inDiscount: false, pairsWith: [] as string[] };
  if (!tags) return result;

  const tagList = tags.split(',').map(t => t.trim().toLowerCase());
  
  for (const t of tagList) {
    if (t.startsWith('tipo:')) result.type = t.substring(5).trim();
    else if (t.startsWith('drop:')) result.aeryxDrop = t.substring(5).trim();
    else if (t.startsWith('tag:')) result.tag = t.substring(4).trim();
    // combina:<slug> → producto complementario elegido a mano (lo sugiere el carrito)
    else if (t.startsWith('combina:')) result.pairsWith.push(t.substring(8).trim());
    else if (t === 'nuevo') result.isNew = true;
    else if (t === 'descuento') result.inDiscount = true;
  }

  return result;
}

export function mapVariant(variant: TiendanubeVariant): ProductVariant {
  return {
    id: variant.id,
    sku: variant.sku,
    price: parseFloat(variant.price || '0'),
    promotionalPrice: variant.promotional_price ? parseFloat(variant.promotional_price) : null,
    stock: variant.stock,
    values: variant.values?.map((v, i) => ({
      name: `Option ${i + 1}`,
      value: getI18nValue(v as any)
    })) || [],
    weight: variant.weight,
    width: variant.width,
    height: variant.height,
    depth: variant.depth
  };
}

export function mapProduct(product: TiendanubeProduct): Product {
  const name = getI18nValue(product.name);
  const slug = getI18nValue(product.handle) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const descriptionRaw = getI18nValue(product.description);
  
  const parsedDesc = parseDescriptionContent(descriptionRaw);
  const tagsMeta = parseTagsMetadata(product.tags);

  const allImages = [...(product.images || [])].sort((a, b) => a.position - b.position).map(img => img.src);
  // La última imagen es la publicitaria (el editor del admin siempre la sube última).
  // Se muestra abajo en el detalle y no forma parte de la galería ni de las tarjetas.
  // Con una sola imagen, esa misma cumple los dos papeles.
  const publicity_image = allImages.length > 0 ? allImages[allImages.length - 1] : '';
  const sortedImages = allImages.length > 1 ? allImages.slice(0, -1) : allImages;

  const variants = (product.variants || []).map(mapVariant);
  const firstVariant = variants[0];
  
  const price = firstVariant?.promotionalPrice ?? firstVariant?.price ?? 0;
  const originalPrice = firstVariant?.price ?? 0;

  const sizes = Array.from(new Set(variants.flatMap(v => v.values.map(val => val.value))));
  
  const stock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  const categoryIdOrObj = product.categories?.[0];
  const category = categoryIdOrObj 
    ? (typeof categoryIdOrObj === 'object' ? getI18nValue((categoryIdOrObj as any).name) : String(categoryIdOrObj))
    : '';

  return {
    _id: String(product.id),
    slug,
    name,
    description: parsedDesc.description,
    specs: parsedDesc.specs,
    features: parsedDesc.features,
    descriptionSetUp: parsedDesc.descriptionSetUp,
    price,
    originalPrice,
    images: sortedImages,
    publicity_image,
    sizes,
    stock,
    category,
    tag: tagsMeta.tag,
    type: tagsMeta.type,
    aeryx_drop: tagsMeta.aeryxDrop,
    isNew: tagsMeta.isNew,
    inDiscount: tagsMeta.inDiscount,
    pairsWith: tagsMeta.pairsWith.filter(Boolean),
    position: String(product.id),
    created_at: product.created_at,
    __v: 0,
    variants
  };
}

export function mapProducts(products: TiendanubeProduct[]): Product[] {
  return (products || []).map(mapProduct);
}

/**
 * Inversa de parseDescriptionContent: arma la descripción de Tiendanube con los
 * bloques ---SPECS---, ---FEATURES--- y ---SETUP--- que la web sabe leer.
 */
export function serializeDescriptionContent(data: {
  description: string;
  specs: ProductSpecs;
  features: string[];
  descriptionSetUp: string[];
}): string {
  const clean = (s: string) => s.replace(/\r?\n/g, ' ').trim();
  const parts = [data.description.trim()];

  const specs = Object.entries(data.specs)
    .map(([k, v]) => [clean(k).replace(/:/g, ''), clean(v)])
    .filter(([k, v]) => k && v);
  if (specs.length) parts.push('---SPECS---', ...specs.map(([k, v]) => `${k}: ${v}`));

  const features = data.features.map(clean).filter(Boolean);
  if (features.length) parts.push('---FEATURES---', ...features.map((f) => `- ${f}`));

  const setup = data.descriptionSetUp.map(clean).filter(Boolean);
  if (setup.length) parts.push('---SETUP---', ...setup.map((s) => `- ${s}`));

  return parts.join('\n');
}

/** Inversa de parseTagsMetadata. */
export function serializeTagsMetadata(meta: {
  pairsWith?: string[];
  tag: string;
  type: string;
  aeryxDrop: string;
  isNew: boolean;
  inDiscount: boolean;
}): string {
  // Las comas separan tags en Tiendanube, así que no pueden ir dentro de un valor
  const clean = (s: string) => s.replace(/,/g, ' ').trim();
  return [
    meta.type && `tipo:${clean(meta.type)}`,
    meta.aeryxDrop && `drop:${clean(meta.aeryxDrop)}`,
    meta.tag && `tag:${clean(meta.tag)}`,
    meta.isNew && 'nuevo',
    meta.inDiscount && 'descuento',
    ...(meta.pairsWith ?? []).map((slug) => `combina:${clean(slug)}`),
  ]
    .filter(Boolean)
    .join(', ');
}
