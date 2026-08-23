import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/lib/interface/ProductInterface";
import { Trash2, Upload } from "lucide-react";
import { ChangeEvent } from "react";

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
    onChange(multiple ? [...images, ...next] : next.slice(0, 1));
    event.target.value = "";
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
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-secondary"
            >
              <img
                src={image.url}
                alt={`Preview ${image.name}`}
                className="aspect-square w-full object-cover"
              />
              {index === 0 && multiple && (
                <Badge className="absolute left-2 top-2">Principal</Badge>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
