import { getProductByHandle } from "@/lib/api/server-api";
import ProductDetail from "@/components/ProductDetail";
import { Footer } from "@/components/Footer/Footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  
  if (!product) {
    return { title: 'Producto no encontrado | AERYX' };
  }

  return {
    title: `${product.name} | AERYX`,
    description: product.description,
    openGraph: {
      title: `${product.name} | AERYX`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetail product={product} />
      <Footer />
    </>
  );
}
