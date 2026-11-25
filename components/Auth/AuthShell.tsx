import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  children: React.ReactNode;
  image: string;
  /** Encuadre de la foto: qué parte queda a la vista al recortarla */
  focus?: string;
  statement: React.ReactNode;
  caption: string;
}

function Wordmark() {
  return (
    <span className="text-[1.375rem] font-medium leading-none tracking-[-0.05em]">
      aery<span className="text-accent">x</span>
    </span>
  );
}

/**
 * Pantalla de acceso: la campaña de un lado, el formulario del otro.
 * En móvil la foto queda como una franja arriba y el formulario manda.
 */
export function AuthShell({ children, image, focus = "50% 20%", statement, caption }: Props) {
  return (
    <main className="grid min-h-svh bg-background text-foreground lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <aside className="relative p-2 pb-0 lg:p-3">
        <div className="auth-visual relative isolate h-56 overflow-hidden rounded-[1.5rem] bg-[#0a0a0a] sm:h-72 lg:sticky lg:top-3 lg:h-[calc(100svh-1.5rem)] lg:rounded-[1.75rem]">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="auth-visual-image -z-10 object-cover"
            style={{ objectPosition: focus }}
          />
          {/* Fundido para leer el texto sobre la foto */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(7,7,7,.92)_0%,rgba(7,7,7,.35)_38%,rgba(7,7,7,0)_62%)]"
          />

          <Link
            href="/"
            aria-label="Aeryx, volver al inicio"
            className="absolute left-5 top-5 rounded-md lg:left-8 lg:top-7"
          >
            <Wordmark />
          </Link>

          <div className="absolute inset-x-5 bottom-5 lg:inset-x-8 lg:bottom-8">
            <p className="hidden text-[clamp(3rem,5.6vw,5.75rem)] font-medium leading-[0.9] tracking-[-0.045em] text-balance lg:block">
              {statement}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-[#f4f4f2]/70 text-pretty lg:mt-5">{caption}</p>
          </div>
        </div>
      </aside>

      <section className="flex flex-col px-6 pb-6 pt-6 sm:px-10 lg:px-14 lg:pt-10">
        <Link
          href="/"
          className="group inline-flex w-fit items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
          Volver a la tienda
        </Link>

        <div className="auth-form mx-auto flex w-full max-w-[29rem] flex-1 flex-col justify-center py-10 lg:py-16">
          {children}
        </div>

        <p className="text-xs text-muted-foreground">
          Aeryx · Envíos a todo el país · Compra protegida
        </p>
      </section>
    </main>
  );
}
