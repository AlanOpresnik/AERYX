import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;

if (!STORE_ID || !ACCESS_TOKEN) {
  console.error("Faltan credenciales de Tiendanube en .env.local");
  process.exit(1);
}

// Estos son los datos de tu viejo producto de MongoDB
const oldProduct = {
  name: "Control MousePad LGG SATURN",
  slug: "control-mousepad-lgg-saturn",
  description: "MOUSEPAD CONTROL PARA GANAR TODAS TUS PARTIDAS",
  category: "Mousepads",
  price: "1",
  stock: 12,
  isNew: true,
  aeryx_drop: "Drop 01",
  type: "Mousepad",
  tag: "Best seller control type",
  
  // Como no pasaste el contenido exacto de specs, armé un ejemplo. 
  // Podés reemplazar estos valores por los reales de tu DB
  specs: {
    Superficie: "Tela control premium",
    Base: "Goma natural antideslizante",
    Espesor: "4mm",
  },
  features: [
    "Costuras reforzadas",
    "Alta durabilidad",
    "Fricción dinámica baja"
  ],
  descriptionSetUp: [
    "Desplegar sobre escritorio",
    "Limpiar con paño húmedo"
  ],
  images: [
    "https://res.cloudinary.com/cuqpvs4s/image/upload/v1723078028/aeryx_products/v0u4m0yow1fqqvtyz9n8.webp",
    "https://res.cloudinary.com/cuqpvs4s/image/upload/v1723078029/aeryx_products/f7h5r4h6s8s4d6s8s4d6.webp"
  ],
  publicity_image: "https://res.cloudinary.com/cuqpvs4s/image/upload/v1786150132/aeryx_products/publicity_saturn.webp"
};

async function migrateProduct() {
  console.log(`Migrando producto: ${oldProduct.name}...`);

  // 1. Convertir los datos estructurados en la descripción de Tiendanube (HTML + delimiters)
  let descriptionHTML = `<p>${oldProduct.description}</p>\n\n`;

  // ---SPECS---
  if (oldProduct.specs && Object.keys(oldProduct.specs).length > 0) {
    descriptionHTML += `\n---SPECS---\n`;
    for (const [key, value] of Object.entries(oldProduct.specs)) {
      descriptionHTML += `${key}: ${value}\n`;
    }
  }

  // ---FEATURES---
  if (oldProduct.features && oldProduct.features.length > 0) {
    descriptionHTML += `\n---FEATURES---\n`;
    oldProduct.features.forEach(f => descriptionHTML += `${f}\n`);
  }

  // ---SETUP---
  if (oldProduct.descriptionSetUp && oldProduct.descriptionSetUp.length > 0) {
    descriptionHTML += `\n---SETUP---\n`;
    oldProduct.descriptionSetUp.forEach(s => descriptionHTML += `${s}\n`);
  }

  // 2. Convertir los flags y metadata en TAGS
  const tagsArray = [];
  if (oldProduct.aeryx_drop) tagsArray.push(`drop:${oldProduct.aeryx_drop}`);
  if (oldProduct.type) tagsArray.push(`tipo:${oldProduct.type}`);
  if (oldProduct.tag) tagsArray.push(`tag:${oldProduct.tag}`);
  if (oldProduct.isNew) tagsArray.push("nuevo");
  tagsArray.push(oldProduct.category);
  
  // Guardamos la publicity image en un tag especial para poder recuperarla luego si no es la primera imagen
  if (oldProduct.publicity_image) {
    tagsArray.push(`publicity:${oldProduct.publicity_image}`);
  }

  const tagsString = tagsArray.join(", ");

  // 3. Preparar el Payload para Tiendanube
  // Ponemos las imagenes regulares en el array de images
  const allImages = [...oldProduct.images];
  // Si publicity_image no está en el array de imágenes, la agregamos para que Tiendanube la guarde
  if (oldProduct.publicity_image && !allImages.includes(oldProduct.publicity_image)) {
    allImages.push(oldProduct.publicity_image);
  }

  const payload = {
    name: { es: oldProduct.name },
    description: { es: descriptionHTML },
    tags: tagsString,
    variants: [
      {
        price: oldProduct.price,
        stock: oldProduct.stock
      }
    ]
  };

  // 4. Enviar a Tiendanube
  try {
    const response = await fetch(`https://api.tiendanube.com/v1/${STORE_ID}/products`, {
      method: "POST",
      headers: {
        "Authentication": `bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "AERYX Migration Script"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error de Tiendanube:", data);
      return;
    }

    console.log("✅ ¡Producto migrado exitosamente a Tiendanube!");
    console.log(`Ver producto en panel: https://admin.tiendanube.com/products/${data.id}`);
    
  } catch (error) {
    console.error("❌ Error de red:", error);
  }
}

migrateProduct();
