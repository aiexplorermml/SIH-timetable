import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, GraduationCap, BookOpen, Calendar, FileText, Settings } from "lucide-react";
import { quickActions } from "../../data/quickActions";

export function QuickActions() {
  const { toast } = useToast();

  const iconMap = {
    UserPlus,
    GraduationCap, 
    BookOpen,
    Calendar,
    FileText,
    Settings
  };

  const handleAction = (actionType: string, label: string) => {
    toast({
      title: "Feature Coming Soon",
      description: `${label} functionality will be available soon`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const IconComponent = iconMap[action.icon as keyof typeof iconMap];
            return (
              <Button
                key={action.actionType}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50 transition-colors"
                onClick={() => handleAction(action.actionType, action.label)}
              >
                <IconComponent className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}