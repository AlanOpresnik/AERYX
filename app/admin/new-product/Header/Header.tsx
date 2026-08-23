import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
    completion: number
}

export default function Header({completion}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            render={<Link href="/" aria-label="Volver al dashboard" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft />
          </Button>
          <div className="min-w-0">
            <p className="truncate font-medium">Nuevo producto</p>
            <p className="text-xs text-muted-foreground">
              Catálogo / Borrador sin guardar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            {completion}% completo
          </Badge>
          <Button type="submit" form="product-form">
            <Save data-icon="inline-start" />
            Publicar
          </Button>
        </div>
      </div>
    </header>
  );
}
