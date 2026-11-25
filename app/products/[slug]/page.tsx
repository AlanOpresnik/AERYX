import { getProductByHandle, getProductById } from "@/lib/api/server-api";
import { PRESALE_GIFT } from "@/lib/presale";
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

  // Manga real que se regala en la preventa: su foto y precio se muestran en la ficha
  const giftSource = await getProductById(PRESALE_GIFT.sourceProductId);
  const giftPreview = giftSource
    ? { name: PRESALE_GIFT.name, image: giftSource.images[0] ?? "", value: giftSource.originalPrice || giftSource.price }
    : null;

  return (
    <>
      <ProductDetail product={product} giftPreview={giftPreview} />
      <Footer />
    </>
  );
}
