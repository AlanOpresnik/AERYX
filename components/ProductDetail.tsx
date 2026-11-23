"use client";

import { useState } from "react";
import { ArrowDown, PackageCheck, ShieldCheck, Truck } from "lucide-react";

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

type ProductDetailProps = {
  product: Product;
};

const perks = [
  { icon: Truck, title: "Envío a todo el país", text: "Despacho en 24–48 h" },
  { icon: ShieldCheck, title: "Compra protegida", text: "Pago seguro" },
  { icon: PackageCheck, title: "Cambios simples", text: "Hasta 30 días" },
];

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart, loading } = useCart();

  const productVariants = (product.variants ?? []).map((v) => ({
    id: v.id,
    name:
      v.values.map((val: { name: string; value: string }) => val.value).join(" / ") ||
      "Único",
    detail: v.sku || "",
    price: v.promotionalPrice ?? v.price,
    compareAt: v.promotionalPrice != null && v.price > v.promotionalPrice ? v.price : null,
    stock: v.stock,
  }));

  const sizes =
    productVariants.length > 0
      ? productVariants
      : [
          {
            id: 0,
            name: "Único",
            detail: "",
            price: product.price,
            compareAt: null as number | null,
            stock: product.stock as number | null,
          },
        ];

  // Arranca en la primera variante con stock
  const [selectedSize, setSelectedSize] = useState(() => {
    const i = sizes.findIndex((s) => s.stock == null || s.stock > 0);
    return i === -1 ? 0 : i;
  });

  const variant = sizes[selectedSize];
  const price = variant?.price || product.price;
  const compareAt =
    variant?.compareAt ??
    (product.originalPrice && product.originalPrice > price ? product.originalPrice : null);

  const stock = variant?.stock;
  const outOfStock = stock != null && stock <= 0;
  const lowStock = stock != null && stock > 0 && stock <= 5;
  const maxQuantity = stock != null && stock > 0 ? Math.min(8, stock) : 8;

  const productForRight = {
    category: product.category,
    _id: product._id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.price) || 0,
  };

  const handleSelectSize = (index: number) => {
    setSelectedSize(index);
    setAdded(false);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (outOfStock) return;
    try {
      await addToCart({
        productId: product._id,
        variantId: variant.id,
        quantity,
        name: product.name,
        price: variant.price,
        image: product.images[0] || "",
        variantName: variant.name,
      });
      setAdded(true);
    } catch (error) {
      console.error("Error agregando producto al carrito:", error);
    }
  };

  return (
    <main id="top" className="overflow-x-clip bg-background pt-20 text-foreground">
      <section
        id="producto"
        className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(26rem,.85fr)]"
      >
        <ImagesProductDetails
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          product={product}
        />

        <div className="flex min-w-0 flex-col px-5 py-10 md:px-10 lg:min-h-[calc(100svh-5rem)] lg:justify-center lg:py-12 lg:pl-14 lg:pr-[6vw]">
          <ProductRigthDetails
            product={productForRight}
            selectedPrice={price}
            compareAtPrice={compareAt}
          />

          <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-border bg-card/60 p-5 md:p-6">
            {sizes.length > 1 || sizes[0].name !== "Único" ? (
              <SizeSelection
                sizes={sizes}
                selectedSize={selectedSize}
                setSelectedSize={handleSelectSize}
              />
            ) : null}

            <AddToCart
              productId={product._id}
              addToCart={handleAddToCart}
              quantity={quantity}
              setQuantity={setQuantity}
              added={added}
              disabled={outOfStock}
              loading={loading}
              maxQuantity={maxQuantity}
            />

            <p
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
              aria-live="polite"
            >
              <span
                className={`relative inline-flex size-2 rounded-full ${
                  outOfStock ? "bg-red-400" : lowStock ? "bg-amber-400" : "bg-emerald-400"
                }`}
              >
                {!outOfStock && (
                  <span
                    className={`absolute inset-0 animate-ping rounded-full opacity-60 ${
                      lowStock ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                  />
                )}
              </span>
              {added
                ? `${quantity} unidad${quantity > 1 ? "es" : ""} agregada${
                    quantity > 1 ? "s" : ""
                  } al carrito`
                : outOfStock
                  ? "Sin stock en esta variante"
                  : lowStock
                    ? `Últimas ${stock} unidades`
                    : "En stock · Listo para despachar"}
            </p>
          </div>

          <ul className="mt-6 grid grid-cols-3 gap-2">
            {perks.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex flex-col gap-2 rounded-xl border border-border/70 p-3"
              >
                <Icon className="size-4 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <strong className="text-xs font-medium leading-tight">{title}</strong>
                  <span className="text-[11px] leading-tight text-muted-foreground">
                    {text}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#tecnologia"
            className="group mt-8 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Explorar tecnología
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>

      <div className="mt-6 lg:mt-0">
        <Benefits />
      </div>

      <DetailsOfProducts product={product} />

      <SpecsDetails product={product} />

      <DividerProductBanner product={product} />

      <Newsletter />
    </main>
  );
}
