import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant: "primary" | "secondary" | "tertiary" | "warning";
}

export function MetricCard({ title, value, subtitle, icon: Icon, variant }: MetricCardProps) {
  const variantStyles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground", 
    tertiary: "bg-tertiary text-tertiary-foreground",
    warning: "bg-warning text-warning-foreground"
  };

  return (
    <Card className="bg-gradient-card shadow-soft-lg border-0 hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          <div className={`p-4 rounded-xl ${variantStyles[variant]} shadow-soft-md`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}