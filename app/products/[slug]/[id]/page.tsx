import ProductDetailWrapper from "../../ProductDetailWrapper/ProductDetailWrapper";
import { Footer } from "@/components/Footer/Footer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  return (
    <>
      <ProductDetailWrapper slug={slug} id={id} />;
      <Footer />
    </>
  );
}
