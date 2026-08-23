"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";

import { Newsletter } from "./NewsLetter/NewsLetter";
import ImagesProductDetails from "@/app/products/components/ImagesProductDetails/ImagesProductDetails";
import SizeSelection from "@/app/products/components/SizeSelection/SizeSelection";
import DetailsOfProducts from "@/app/products/components/DetailsOfProduct/DetailsOfProducts";
import SpecsDetails from "@/app/products/components/SpecsDetails/SpecsDetails";
import DividerProductBanner from "@/app/products/components/DividerProductBanner/DividerProductBanner";
import ProductRigthDetails from "@/app/products/components/ProductRigthDetails/ProductRigthDetails";
import { Benefits } from "./Benefits/Benefits";
import AddToCart from "@/app/products/components/AddToCart/AddToCart";
import { Product } from "@/lib/interface/ProductInterface";
import { useCart } from "@/app/context/cartContext";


const sizes = [
  {
    name: "L",
    detail: "49 × 42 cm",
    price: 50000,
  },
];

type ProductDetailProps = {
  product: Product;
};

export default function ProductDetail({
  product,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart, loading } = useCart();

  const price = sizes[selectedSize].price;

  const productForRight = {
    category: product.category,
    _id: product._id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.price) || 0,
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product._id,
        quantity,
      });

      setAdded(true);
    } catch (error) {
      console.error("Error agregando producto al carrito:", error);
    }
  };

  return (
    <main
      id="top"
      className="h- overflow-hidden bg-background text-foreground mt-20"
    >
      <section
        id="producto"
        className="grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(28rem,.92fr)]"
      >
        <ImagesProductDetails
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          product={product}
        />

        <div className="flex min-w-0 flex-col px-4 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
          <ProductRigthDetails
            product={productForRight}
            selectedPrice={price}
          />

          <SizeSelection
            sizes={sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />

          <AddToCart
            productId={product._id}
            addToCart={handleAddToCart}
            quantity={quantity}
            setQuantity={setQuantity}
            added={added}
          />

          <p
            className="mt-4 min-h-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            aria-live="polite"
          >
            {added
              ? `${quantity} unidad${
                  quantity > 1 ? "es" : ""
                } agregada${
                  quantity > 1 ? "s" : ""
                } al carrito.`
              : "En stock · Despacho en 24–48 h"}
          </p>

          <a
            href="#tecnologia"
            className="mt-10 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Explorar tecnología
            <ArrowDown className="size-4" />
          </a>
        </div>
      </section>

      <Benefits />

      <DetailsOfProducts product={product} />

      <SpecsDetails product={product} />

      <DividerProductBanner product={product} />

      <Newsletter />
    </main>
  );
}