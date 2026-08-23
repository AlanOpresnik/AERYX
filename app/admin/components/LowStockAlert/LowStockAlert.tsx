"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api/api";
import { AlertTriangle } from "lucide-react";

type Product = {
  _id?: string;
  slug: string;
  name: string;
  stock: number;
  category: string;
};

export default function LowStockAlert() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);

        const response = await api.products.getAll();

        if (!cancelled) {
          setProducts(response ?? []);
        }
      } catch (error) {
        console.error("Error obteniendo productos:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const lowStockProducts = products.filter(
    (product) => product.stock < 15,
  );

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Control de stock</CardTitle>

          <CardDescription>
            Productos que requieren atención.
          </CardDescription>
        </div>

        <AlertTriangle className="size-5 text-primary" />
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Cargando productos...
          </p>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay productos.
          </p>
        ) : lowStockProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay productos con stock bajo.
          </p>
        ) : (
          lowStockProducts.map((product) => (
            <div
              key={product._id ?? product.slug}
              className="flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {product.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {product.stock} unidades disponibles
                  </p>
                </div>

                <Badge variant="outline">
                  {product.category}
                </Badge>
              </div>

              <Progress
                value={Math.min((product.stock / 20) * 100, 100)}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}