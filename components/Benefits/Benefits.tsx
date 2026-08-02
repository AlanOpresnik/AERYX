import { Headphones, PackageCheck, ShieldCheck, Truck } from "lucide-react";

export function Benefits() {
    const benefits = [
      {
        icon: Truck,
        title: "Envíos a todo el país",
        text: "Seguimiento en cada etapa",
      },
      {
        icon: ShieldCheck,
        title: "Compra protegida",
        text: "Pagos seguros y verificados",
      },
      { icon: PackageCheck, title: "Cambios simples", text: "Hasta 30 días" },
      { icon: Headphones, title: "Soporte real", text: "Te ayudamos a elegir" },
    ];
  return (
    <section
      className="grid grid-cols-2 border-b border-neutral-300 bg-foreground text-background lg:grid-cols-4 "
      aria-label="Beneficios de compra"
    >
      {benefits.map(({ icon: Icon, title, text }, i) => (
        <div
          className={`flex items-center gap-4 border-neutral-300 p-4 lg:px-8 lg:py-6 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} ${i < 3 ? "lg:border-r" : ""}`}
          key={title}
        >
          <Icon className="hidden size-5 sm:block" />
          <div className="flex flex-col gap-1">
            <strong className="text-sm">{title}</strong>
            <span className="text-xs text-neutral-500">{text}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
