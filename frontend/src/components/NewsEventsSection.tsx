import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { newsEvents, getBadgeVariant, getPriorityColor } from "../../data/newsEvents";

export function NewsEventsSection() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Recent News & Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {newsEvents.slice(0, 5).map((event) => (
            <div key={event.id} className="border-l-4 border-primary/20 pl-4 py-2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm leading-tight">
                  {event.title}
                </h4>
                <Badge variant={getBadgeVariant(event.type)} className="text-xs shrink-0">
                  {event.type}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {event.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <span className={`text-xs font-medium ${getPriorityColor(event.priority)}`}>
                  {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}