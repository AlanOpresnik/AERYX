import { Headphones, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  { icon: Truck, title: "Envíos a todo el país", text: "Seguimiento en cada etapa" },
  { icon: ShieldCheck, title: "Compra protegida", text: "Pagos seguros y verificados" },
  { icon: PackageCheck, title: "Cambios simples", text: "Hasta 30 días" },
  { icon: Headphones, title: "Soporte real", text: "Te ayudamos a elegir" },
];

export function Benefits() {
  return (
    <section
      className="grid grid-cols-2 gap-px bg-background/10 text-background lg:grid-cols-4"
      aria-label="Beneficios de compra"
    >
      {benefits.map(({ icon: Icon, title, text }) => (
        <div
          className="flex items-start gap-3 bg-foreground px-5 py-5 md:px-8 md:py-6"
          key={title}
        >
          <Icon className="mt-0.5 size-4 shrink-0 text-background/50" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <strong className="text-sm font-medium">{title}</strong>
            <span className="text-[13px] text-neutral-600">{text}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
