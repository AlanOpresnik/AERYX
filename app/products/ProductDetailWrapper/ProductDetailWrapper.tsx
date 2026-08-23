import ProductDetail from "@/components/ProductDetail";
import { api } from "@/lib/api/api";
import { notFound } from "next/navigation";

interface Props {
  slug: string;
  id:string;
}

export default async function ProductDetailWrapper({ slug,id }: Props) {
  const product = await api.products.getById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
