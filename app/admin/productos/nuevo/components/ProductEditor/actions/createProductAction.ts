"use server";

import { checkSuperadmin } from "@/lib/auth/superadmin";
import { tiendanube } from "@/lib/tiendanube/client";
import { revalidateCategories, revalidateProducts } from "@/lib/tiendanube/cache";
import { getI18nValue, serializeDescriptionContent, serializeTagsMetadata } from "@/lib/tiendanube/product-mapper";

export type ProductDraftInput = {
  name: string;
  slug: string;
  tag: string;
  category: string;
  drop: string;
  type: string;
  price: number;
  originalPrice: number;
  /** null = stock ilimitado */
  stock: number | null;
  description: string;
  isNew: boolean;
  inDiscount: boolean;
  sizes: string[];
  features: string[];
  setup: string[];
  specs: Record<string, string>;
  /** Slugs de productos que combinan (se sugieren en el carrito) */
  pairsWith?: string[];
};

type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

/** Devuelve el error al formulario y lo deja también en la terminal del servidor. */
function reject(error: string): { ok: false; error: string } {
  console.warn("[Admin] Producto no guardado:", error);
  return { ok: false, error };
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Solo el superadmin puede escribir en Tiendanube. */
async function requireAdmin(): Promise<string | null> {
  const access = await checkSuperadmin();
  return access.ok ? null : access.error;
}

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[Admin] Tiendanube:", message);
  if (/Error (401|403)/.test(message)) {
    return "Tiendanube rechazó el pedido: la app no tiene permiso para escribir productos (write_products). Volvé a autorizarla desde tu tienda.";
  }
  if (/Error 422/.test(message)) {
    return `Tiendanube no aceptó los datos: ${message.replace(/^.*Error 422: /, "")}`;
  }
  if (/not configured/.test(message)) {
    return "Faltan las variables de entorno de Tiendanube.";
  }
  return "No se pudo guardar en Tiendanube. Probá de nuevo en un momento.";
}

async function findOrCreateCategory(name: string): Promise<number | undefined> {
  const wanted = name.trim();
  if (!wanted) return undefined;
  const categories = await tiendanube.getCategories({ per_page: 200 });
  const match = categories.find(
    (c) => getI18nValue(c.name).trim().toLowerCase() === wanted.toLowerCase(),
  );
  if (match) return match.id;
  const created = await tiendanube.createCategory(wanted);
  revalidateCategories();
  return created.id;
}

/** Paso 1: crea el producto oculto (sin publicar) y devuelve su id. */
export async function createProductDraft(input: ProductDraftInput): Promise<Result<{ id: number }>> {
  const denied = await requireAdmin();
  if (denied) return reject(denied);

  const name = input.name?.trim();
  const price = Number(input.price);
  const original = Number(input.originalPrice);
  if (!name) return reject("Falta el nombre.");
  if (!Number.isFinite(price) || price <= 0) return reject("El precio tiene que ser mayor a 0.");
  if (input.stock !== null && (!Number.isInteger(input.stock) || input.stock < 0)) {
    return reject("El stock tiene que ser un número entero positivo.");
  }

  // Con descuento: el precio de lista es el original y el precio de venta va como promocional
  const discounted = input.inDiscount && Number.isFinite(original) && original > price;
  const variantBase = {
    price: String(discounted ? original : price),
    promotional_price: discounted ? String(price) : null,
    stock: input.stock,
  };
  const sizes = Array.from(new Set(input.sizes.map((s) => s.trim()).filter(Boolean)));

  try {
    const categoryId = await findOrCreateCategory(input.category);
    const product = await tiendanube.createProduct({
      name: { es: name },
      handle: { es: input.slug.trim() },
      description: {
        es: serializeDescriptionContent({
          description: input.description,
          specs: input.specs,
          features: input.features,
          descriptionSetUp: input.setup,
        }),
      },
      tags: serializeTagsMetadata({
        pairsWith: (input.pairsWith ?? []).filter((s) => /^[a-z0-9-]{1,120}$/.test(s)).slice(0, 12),
        tag: input.tag,
        type: input.type,
        aeryxDrop: input.drop,
        isNew: input.isNew,
        inDiscount: discounted,
      }),
      published: false,
      ...(categoryId ? { categories: [categoryId] } : {}),
      ...(sizes.length
        ? {
            attributes: [{ es: "Variante" }],
            variants: sizes.map((size) => ({ ...variantBase, values: [{ es: size }] })),
          }
        : { variants: [variantBase] }),
    });
    return { ok: true, data: { id: product.id } };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}

/** Paso 2: sube una imagen. Se llama una vez por foto para no pasar el límite de tamaño. */
export async function uploadProductImage(formData: FormData): Promise<Result> {
  const denied = await requireAdmin();
  if (denied) return reject(denied);

  const productId = Number(formData.get("productId"));
  const position = Number(formData.get("position"));
  const file = formData.get("file");
  if (!Number.isInteger(productId) || !(file instanceof File)) {
    return reject("Imagen inválida.");
  }
  if (!file.type.startsWith("image/")) return reject(`${file.name} no es una imagen.`);
  if (file.size > MAX_IMAGE_BYTES) return reject(`${file.name} pesa más de 8 MB.`);

  try {
    await tiendanube.addProductImage(productId, {
      attachment: Buffer.from(await file.arrayBuffer()).toString("base64"),
      filename: file.name,
      position: Number.isInteger(position) && position > 0 ? position : 1,
    });
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}

/** Paso 3: publica el producto y refresca la web. */
export async function publishProduct(productId: number): Promise<Result> {
  const denied = await requireAdmin();
  if (denied) return reject(denied);
  if (!Number.isInteger(productId)) return reject("Producto inválido.");

  try {
    await tiendanube.updateProduct(productId, { published: true });
    revalidateProducts();
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}
