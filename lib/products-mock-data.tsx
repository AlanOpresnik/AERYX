export type Product = {
  slug: string
  tag: string
  name: string
  category: string
  price: string
  image: string
  position: string
  description: string
  features: string[]
}

export const products: Product[] = [
  {
    slug: "mousepad-control-pro",
    tag: "MÁS VENDIDO",
    name: "Mousepad Control Pro",
    category: "Precisión",
    price: "$39.900",
    image: 'https://shop.9z.gg/web/image/product.template/262872/image_1024?unique=d715e33',
    position: "50% 22%",
    description:
      "Superficie de alta densidad para movimiento suave y control total, ideal para sesiones largas y maximizando la exactitud.",
    features: [
      "Textura microtexturizada para precisión de seguimiento.",
      "Base antideslizante de goma natural para estabilidad.",
      "Acabado resistente a derrames y fácil de limpiar.",
    ],
  },  {
    slug: "mousepad-control-pro2",
    tag: "MÁS VENDIDO",
    name: "Mousepad Control Pro2",
    category: "Precisión",
    price: "$39.900",
    image: 'https://shop.9z.gg/web/image/product.template/262872/image_1024?unique=d715e33',
    position: "50% 22%",
    description:
      "Superficie de alta densidad para movimiento suave y control total, ideal para sesiones largas y maximizando la exactitud.",
    features: [
      "Textura microtexturizada para precisión de seguimiento.",
      "Base antideslizante de goma natural para estabilidad.",
      "Acabado resistente a derrames y fácil de limpiar.",
    ],
  },
  {
    slug: "mousepad-speed-xl",
    tag: "NUEVO",
    name: "Mousepad Speed XL",
    category: "Velocidad",
    price: "$44.900",
    image: 'https://acdn-us.mitiendanube.com/stores/005/542/994/products/atkxleviantan-00-4009235f8554276c4517636760690873-480-0.webp',
    position: "50% 74%",
    description:
      "Diseñado para jugadores agresivos que necesitan menos fricción y mayor reactividad en cada trayectoria.",
    features: [
      "Superficie ultrarrápida para deslizamientos explosivos.",
      "Tamaño XL para mayor libertad de movimiento.",
      "Costuras reforzadas para durabilidad prolongada.",
    ],
  },
  {
    slug: "manga-performance",
    tag: "EDICIÓN 01",
    name: "Manga Performance",
    category: "Rendimiento",
    price: "$24.900",
    image: 'https://www-cdn.solodeportes.com.ar/media/catalog/product/m/a/mangas-de-compresion-dribbling-negra-24104dcijau010b-3.jpg?width=525&height=525&store=solodeportes&image-type=image',
    position: "25% 50%",
    description:
      "Ajuste ergonómico de compresión para mantener la temperatura muscular y soporte en entrenamientos intensos.",
    features: [
      "Tejido elástico que acompaña cada movimiento.",
      "Compresión graduada para mejor circulación.",
      "Costuras planas para confort sin rozaduras.",
    ],
  },
  {
    slug: "kit-competitive",
    tag: "PACK",
    name: "Kit Competitive",
    category: "Colección",
    price: "$69.900",
    image: 'https://wallhack.com/cdn/shop/files/2048x2048_WEB_PRODUCT-IMG-GlassPad-SP-004A-Black-Image4.webp?v=1757665503',
    position: "74% 50%",
    description:
      "Set premium con un mousepad amplio y accesorios diseñados para jugadores que buscan rendimiento total.",
    features: [
      "Pack optimizado para setup competitivo.",
      "Componentes diseñados para precisión y durabilidad.",
      "Estética minimalista que combina con cualquier escritorio.",
    ],
  },
];

export const mono = 'font-mono text-[.66rem] font-medium uppercase tracking-[.16em]'
export const pagePad = 'px-6 md:px-[6vw]'