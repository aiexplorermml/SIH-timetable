import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  className 
}: StatCardProps) {
  return (
    <Card className={cn(
      "bg-gradient-card shadow-elegant border-0 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                {value}
              </p>
              
              <div className="flex items-center gap-2">
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
                {trend && (
                  <div className={cn(
                    "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                    trend.isPositive 
                      ? "bg-tertiary/10 text-tertiary" 
                      : "bg-destructive/10 text-destructive"
                  )}>
                    <span>
                      {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}