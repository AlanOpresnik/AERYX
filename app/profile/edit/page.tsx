import { redirect } from "next/navigation";

// Ruta vieja: los datos ahora se editan en /profile/datos
export default function LegacyEdit() {
  redirect("/profile/datos");
}
