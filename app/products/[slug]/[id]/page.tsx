import { getProductById } from "@/lib/api/server-api";
import { notFound, redirect } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;

  // Try to fetch by ID (backward compatibility with old MongoDB URLs)
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Redirect to the new canonical URL using the Tiendanube handle
  redirect(`/products/${product.slug}`);
}
