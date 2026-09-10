"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { Check, ImageIcon, Save } from "lucide-react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ListField from "../ListField/ListField";
import ImageUploader from "../ImageUploader/ImageUploader";
import { ImagePreview } from "@/lib/interface/ProductInterface";
import Header from "../../Header/Header";
import { api } from "@/lib/api/api";

type SpecKey = "Superficie" | "Base" | "espesor" | "Compatibilidad" | "Cuidado";

const specLabels: SpecKey[] = [
  "Superficie",
  "Base",
  "espesor",
  "Compatibilidad",
  "Cuidado",
];

const initialSpecs: Record<SpecKey, string> = {
  Superficie: "",
  Base: "",
  espesor: "",
  Compatibilidad: "",
  Cuidado: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type ProductFormValues = {
  name: string;
  slug: string;
  tag: string;
  category: string;
  drop: string;
  type: string;
  position: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  isNew: boolean;
  inDiscount: boolean;
  sizes: string[];
  features: string[];
  setup: string[];
  specs: Record<string, string>;
  images: ImagePreview[];
  publicity: ImagePreview[];
};

type FieldConfig = {
  name: keyof ProductFormValues;
  label: string;
  placeholder?: string;
  type?: string;
  span?: number;
};

const productFields: FieldConfig[] = [
  {
    name: "name",
    label: "Nombre *",
    placeholder: "Ej. Control Mousepad XL",
    span: 2,
  },
  { name: "slug", label: "Slug *", placeholder: "control-mousepad-xl" },
  { name: "tag", label: "Tag *", placeholder: "Best seller" },
  { name: "category", label: "Categoría *", placeholder: "Mousepads" },
  { name: "drop", label: "Aeryx drop *", placeholder: "Drop 02" },
  { name: "type", label: "Tipo *", placeholder: "Accesorio" },
  { name: "position", label: "Posición *", placeholder: "01" },
];

const inventoryFields: FieldConfig[] = [
  { name: "price", label: "Precio *", placeholder: "75900", type: "number" },
  {
    name: "originalPrice",
    label: "Precio original *",
    placeholder: "89900",
    type: "number",
  },
  { name: "stock", label: "Stock", type: "number" },
];

function FieldGrid({
  fields,
  register,
  setValue,
}: {
  fields: FieldConfig[];
  register: UseFormRegister<ProductFormValues>;
  setValue: ReturnType<typeof useForm<ProductFormValues>>["setValue"];
}) {
  return (
    <>
      {fields.map((field) => (
        <div
          key={field.name}
          className={`flex flex-col gap-2 ${field.span === 2 ? "md:col-span-2" : ""}`}
        >
          <p className="font-medium">{field.label}</p>
          <Input
            {...register(field.name as any, {
              required: field.name !== "stock",
              onChange:
                field.name === "slug"
                  ? (event) => {
                      setValue("slug", slugify(event.target.value));
                    }
                  : undefined,
            })}
            id={field.name}
            type={field.type ?? "text"}
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">{children}</CardContent>
    </Card>
  );
}

export default function ProductEditor() {
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      tag: "",
      category: "",
      drop: "",
      type: "",
      position: "",
      price: "",
      originalPrice: "",
      stock: "0",
      description: "",
      isNew: false,
      inDiscount: false,
      sizes: [],
      features: [],
      setup: [],
      specs: initialSpecs,
      images: [],
      publicity: [],
    },
  });

  const { register, handleSubmit, setValue, watch } = form;
  const values = watch();

  type SpecEntry = { id: string; key: string; value: string };
  const [specEntries, setSpecEntries] = useState<SpecEntry[]>(() =>
    Object.entries(values.specs || {}).map(([k, v]) => ({
      id: crypto.randomUUID(),
      key: k,
      value: v,
    })),
  );

  useEffect(() => {
    const obj = specEntries.reduce<Record<string, string>>((acc, e) => {
      if (e.key) acc[e.key] = e.value;
      return acc;
    }, {});
    setValue("specs", obj, { shouldDirty: true });
  }, [specEntries, setValue]);

  const addSpec = () =>
    setSpecEntries((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: "", value: "" },
    ]);

  const updateSpecKey = (index: number, keyVal: string) =>
    setSpecEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], key: keyVal };
      return next;
    });

  const updateSpecValue = (index: number, valueVal: string) =>
    setSpecEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value: valueVal };
      return next;
    });

  const removeSpec = (index: number) =>
    setSpecEntries((prev) => prev.filter((_, i) => i !== index));

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(values.name || ""), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [slugTouched, values.name, setValue]);

  useEffect(
    () => () => {
      [...values.images, ...values.publicity].forEach((image) =>
        URL.revokeObjectURL(image.url),
      );
    },
    [values.images, values.publicity],
  );

  const completion = useMemo(() => {
    const required = [
      values.name,
      values.slug,
      values.tag,
      values.category,
      values.drop,
      values.price,
      values.originalPrice,
      values.position,
      values.description,
      values.type,
    ];

    return Math.round(
      ((required.filter(Boolean).length +
        (values.images.length ? 1 : 0) +
        (values.publicity.length ? 1 : 0) +
        (values.features.length ? 1 : 0) +
        (values.sizes.length ? 1 : 0) +
        (values.setup.length ? 1 : 0)) /
        15) *
        100,
    );
  }, [values]);

  const createFormData = (data: ProductFormValues) => {
    console.log("IMAGES DATA:", data.images);

    data.images.forEach((image) => {
      console.log("IMAGE:", {
        name: image.name,
        url: image.url,
        file: image.file,
        isFile: image.file instanceof File,
      });
    });
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("tag", data.tag);
    formData.append("category", data.category);
    formData.append("drop", data.drop);
    formData.append("type", data.type);
    formData.append("position", data.position);
    formData.append("price", data.price);
    formData.append("originalPrice", data.originalPrice);
    formData.append("stock", String(Number(data.stock || "0")));
    formData.append("description", data.description);
    formData.append("isNew", String(data.isNew));
    formData.append("inDiscount", String(data.inDiscount));

    data.sizes.forEach((size) => formData.append("sizes", size));
    data.features.forEach((feature) => formData.append("features", feature));
    data.setup.forEach((item) => formData.append("setup", item));

    Object.entries(data.specs).forEach(([key, value]) => {
      formData.append(`specs[${key}]`, value);
    });

    data.images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file, image.name);
      }
    });

    data.publicity.forEach((image) => {
      if (image.file) {
        formData.append("publicity", image.file, image.name);
      }
    });

    return formData;
  };

  const logSubmit = (data: ProductFormValues) => {
    const formPayload = {
      ...data,
      images: data.images.map((image) => image.url),
      publicity: data.publicity.map((image) => image.url),
    };
    const apiPayload = createFormData(data);

    console.log("FORM payload que se usaría en la vista:", formPayload);
    console.log("FormData se enviaría al backend con archivos reales.");
    console.log("fetch('/api/products', { method: 'POST', body: formData })");
  };

  const onSubmit = handleSubmit(async (_data) => {
    // DEPRECATED: Product creation is now managed through Tiendanube admin panel
    alert(
      "La creación de productos se gestiona ahora desde el panel de administración de Tiendanube. " +
      "Ingresá a tu tienda en tiendanube.com para agregar, editar o eliminar productos."
    );
  });

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <Header completion={completion} />

      <form
        id="product-form"
        onSubmit={onSubmit}
        className="mx-auto grid max-w-375 gap-6 p-4 md:p-8 xl:grid-cols-[minmax(0,1fr)_380px]"
      >
        <div className="flex min-w-0 flex-col gap-6">
          {submitted && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm"
            >
              <Check className="size-5 text-primary" />
              Producto validado y listo para publicar en esta demo.
            </div>
          )}

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Aeryx catalog
            </p>
            <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Creá una nueva pieza.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Completá la información comercial, técnica y visual del producto.
            </p>
          </div>

          <SectionCard
            title="Información principal"
            description="Los datos que identifican el producto en la tienda."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FieldGrid
                fields={productFields}
                register={register}
                setValue={setValue}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Precio e inventario"
            description="Valores comerciales, disponibilidad y etiquetas."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <FieldGrid
                fields={inventoryFields}
                register={register}
                setValue={setValue}
              />
              <div className="flex items-center justify-between rounded-xl border border-border p-4 md:col-span-1">
                <p className="font-medium">Producto nuevo</p>
                <Switch
                  id="isNew"
                  checked={values.isNew}
                  onCheckedChange={(value) => setValue("isNew", value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-4 md:col-span-2">
                <Label htmlFor="discount">En descuento</Label>
                <Switch
                  id="discount"
                  checked={values.inDiscount}
                  onCheckedChange={(value) => setValue("inDiscount", value)}
                />
              </div>

              <div className="md:col-span-3">
                <ListField
                  label="Talles *"
                  items={values.sizes}
                  setItems={(items) => setValue("sizes", items)}
                  placeholder="Ej. XL"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Contenido del producto"
            description="Descripción, beneficios y armado del setup."
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  {...register("description", { required: true })}
                  id="description"
                  rows={5}
                  placeholder="Contá qué hace especial a este producto..."
                />
              </div>

              <ListField
                label="Características *"
                items={values.features}
                setItems={(items) => setValue("features", items)}
                placeholder="Ej. Deslizamiento preciso"
              />

              <ListField
                label="Descripción del setup *"
                items={values.setup}
                setItems={(items) => setValue("setup", items)}
                placeholder="Ej. Ideal para escritorios amplios"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Especificaciones técnicas"
            description="Completá los datos disponibles para este producto."
          >
            <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-3 md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Especificaciones</p>
                    <p className="text-xs text-muted-foreground">Agregá títulos y valores libres.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {specEntries.map((entry, idx) => (
                      <div key={entry.id} className="flex gap-2 items-center">
                        <Input
                          value={entry.key}
                          onChange={(e) => updateSpecKey(idx, e.target.value)}
                          placeholder="Título (ej. Superficie)"
                        />
                        <Input
                          value={entry.value}
                          onChange={(e) => updateSpecValue(idx, e.target.value)}
                          placeholder="Detalle"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpec(idx)}
                          aria-label="Eliminar especificación"
                        >
                          <X />
                        </Button>
                      </div>
                    ))}

                    <Button type="button" onClick={addSpec} variant="outline">
                      Agregar especificación
                    </Button>
                  </div>
                </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Galería visual"
            description="La primera imagen será la portada principal del producto."
          >
            <div className="flex flex-col gap-8">
              <ImageUploader
                title="Imágenes del producto *"
                description="Elegí varias tomas para mostrar el producto."
                images={values.images}
                onChange={(next) => setValue("images", next)}
              />
              <ImageUploader
                title="Imagen publicitaria *"
                description="Pieza horizontal o editorial para campañas."
                images={values.publicity}
                onChange={(next) => setValue("publicity", next)}
                multiple={false}
              />
              {(values.images.length === 0 ||
                values.publicity.length === 0) && (
                <p className="text-xs text-muted-foreground">
                  Para publicar necesitás al menos una imagen del producto y una
                  publicitaria.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-28 xl:self-start">
          <Card className="overflow-hidden">
            <div className="relative flex aspect-4/5 items-center justify-center bg-secondary">
              {values.images[0] ? (
                <img
                  src={values.images[0].url}
                  alt="Vista previa principal del producto"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <ImageIcon className="size-8" />
                  <span className="text-sm">Vista previa del producto</span>
                </div>
              )}
              {values.isNew && (
                <Badge className="absolute left-4 top-4">Nuevo</Badge>
              )}
            </div>
            <CardContent className="flex flex-col gap-4 p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">
                  {values.category || "Categoría"}
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  {values.name || "Nombre del producto"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {values.tag || "Tag comercial"}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-mono text-lg">
                  ${Number(values.price || 0).toLocaleString("es-AR")}
                </span>
                {values.inDiscount && (
                  <span className="font-mono text-sm text-muted-foreground line-through">
                    ${Number(values.originalPrice || 0).toLocaleString("es-AR")}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{values.stock || 0} unidades</span>
                <span>{values.sizes.length} talles</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estado de carga</CardTitle>
              <CardDescription>
                {completion}% del contenido completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg">
            <Save data-icon="inline-start" />
            Publicar producto
          </Button>
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            type="button"
            variant="ghost"
          >
            Cancelar y volver
          </Button>
        </aside>
      </form>
    </main>
  );
}
