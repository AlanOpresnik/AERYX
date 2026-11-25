import type { Metadata } from "next";
import { requireSuperadmin } from "@/lib/auth/superadmin";
import { listProducts } from "@/lib/admin/data";
import ProductEditor from "./components/ProductEditor/ProductEditor";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  await requireSuperadmin("/admin/productos/nuevo");
  const catalog = await listProducts().catch(() => []);
  return (
    <ProductEditor
      catalog={catalog.map((p) => ({ slug: p.slug, name: p.name, image: p.image }))}
    />
  );
}
