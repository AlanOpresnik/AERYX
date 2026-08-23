import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard } from "lucide-react";

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: typeof CreditCard;
}) {
  return (
    <Card className="border-border/70 bg-card/60 shadow-none">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl tracking-tight">{value}</CardTitle>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="flex items-center text-primary">
            <ArrowUpRight className="size-3" />
            {change}
          </span>{" "}
          vs. mes anterior
        </p>
      </CardContent>
    </Card>
  );
}