import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  images: { src: string; alt: string }[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export default function ImagesProductDetails({
  images,
  selectedImage,
  setSelectedImage,
}: Props) {
  return (
    <div className="border-b border-border lg:border-b-0 lg:border-r">
      <div className="relative aspect-square overflow-hidden bg-muted lg:aspect-auto lg:h-[calc(100vh-10rem)] lg:min-h-[43rem]">
        <Image
          src={images[selectedImage].src}
          alt={images[selectedImage].alt}
          width={1200}
          height={800}
          className="h-full w-full object-cover "
        />
        <span className="absolute left-5 top-5 rounded-full bg-background px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em]">
          Best seller / 01
        </span>
        <span className="absolute bottom-5 right-5 font-mono text-[10px] uppercase tracking-[0.15em] text-background">
          0{selectedImage + 1} / 03
        </span>
      </div>
      <div className="grid grid-cols-3 border-t border-border">
        {images.map((image, index) => (
          <button
            key={image.src + index}
            type="button"
            onClick={() => setSelectedImage(index)}
            aria-label={`Ver imagen ${index + 1}`}
            aria-pressed={selectedImage === index}
            className={cn(
              "relative aspect-[4/2.3] overflow-hidden border-r border-border last:border-r-0",
              selectedImage === index
                ? "opacity-100"
                : "opacity-50 hover:opacity-80",
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 h-1 bg-primary transition-transform",
                selectedImage === index ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
