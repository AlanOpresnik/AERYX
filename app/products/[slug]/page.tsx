import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { products } from "@/lib/products-mock-data";
import { Header } from "@/components/Header/Header";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((product) => product.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full bg-black/90 backdrop-blur-md ">
        <Header />
      </div>
      <ProductDetail product={product} />;
    </>
  );
}
