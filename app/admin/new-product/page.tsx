import { redirect } from "next/navigation";

// Ruta vieja: el editor ahora vive en /admin/productos/nuevo
export default function LegacyNewProduct() {
  redirect("/admin/productos/nuevo");
}
