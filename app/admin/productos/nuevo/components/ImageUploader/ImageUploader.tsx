import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/lib/interface/ProductInterface";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, GripVertical, Trash2, Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useState } from "react";

export default function ImageUploader({
  images,
  onChange,
  multiple = true,
  title,
  description,
}: {
  images: ImagePreview[];
  onChange: (images: ImagePreview[]) => void;
  multiple?: boolean;
  title: string;
  description: string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    const next = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    if (!multiple) images.forEach((image) => URL.revokeObjectURL(image.url));
    // Lo nuevo siempre va después de lo que ya estaba cargado
    onChange(multiple ? [...images, ...next] : next.slice(0, 1));
    event.target.value = "";
  };

  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const onDrop = (event: DragEvent, index: number) => {
    event.preventDefault();
    if (dragIndex !== null) move(dragIndex, index);
    endDrag();
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/20 p-6 text-center transition-colors hover:bg-secondary/40">
        <Upload className="size-5 text-primary" />
        <span className="text-sm font-medium">
          Seleccionar {multiple ? "imágenes" : "imagen"}
        </span>
        <span className="text-xs text-muted-foreground">PNG, JPG o WebP</span>
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFiles}
        />
      </label>

      {multiple && images.length > 1 && (
        <p className="text-xs text-muted-foreground">
          Se publican en este orden y la primera es la portada. Arrastrá las fotos
          o usá las flechas para reordenarlas.
        </p>
      )}

      {images.length > 0 && (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={image.id}
              draggable={multiple && images.length > 1}
              onDragStart={(event) => {
                setDragIndex(index);
                event.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(event) => {
                if (dragIndex === null) return;
                event.preventDefault();
                setOverIndex(index);
              }}
              onDrop={(event) => onDrop(event, index)}
              onDragEnd={endDrag}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-border bg-secondary transition-[opacity,box-shadow] duration-150",
                multiple && images.length > 1 && "cursor-grab active:cursor-grabbing",
                dragIndex === index && "opacity-40",
                overIndex === index && dragIndex !== index && "ring-2 ring-primary",
              )}
            >
              <img
                src={image.url}
                alt={`Imagen ${index + 1}: ${image.name}`}
                draggable={false}
                className="aspect-square w-full object-cover"
              />

              {multiple && (
                <Badge
                  variant={index === 0 ? "default" : "secondary"}
                  className="absolute left-2 top-2 gap-1 tabular-nums"
                >
                  {images.length > 1 && <GripVertical className="size-3" />}
                  {index === 0 ? "1 · Portada" : index + 1}
                </Badge>
              )}

              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => {
                  URL.revokeObjectURL(image.url);
                  onChange(images.filter((item) => item.id !== image.id));
                }}
                aria-label={`Eliminar ${image.name}`}
              >
                <Trash2 />
              </Button>

              {multiple && images.length > 1 && (
                <div className="absolute inset-x-2 bottom-2 flex justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-8"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    aria-label={`Mover ${image.name} antes`}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-8"
                    disabled={index === images.length - 1}
                    onClick={() => move(index, index + 1)}
                    aria-label={`Mover ${image.name} después`}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
