import { redirect } from "next/navigation";

// Ruta vieja (flujo anterior de pago): la confirmación ahora vive en /checkout/gracias
export default function LegacySuccess() {
  redirect("/checkout/gracias");
}
