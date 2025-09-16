import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Calendar, MapPin, User } from "lucide-react";
import { NewsEvent } from "@/types/newsEvent";

interface NewsEventsListProps {
  newsEvents: NewsEvent[];
  onViewDetails: (newsEvent: NewsEvent) => void;
  onEdit: (newsEvent: NewsEvent) => void;
  onDelete: (newsEvent: NewsEvent) => void;
}

export function NewsEventsList({ newsEvents, onViewDetails, onEdit, onDelete }: NewsEventsListProps) {
  if (newsEvents.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No news or events found</p>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your search criteria or filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "News":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Event":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {newsEvents.map((item) => (
        <Card key={item.id} className="shadow-soft hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                  <Badge variant="secondary">
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {item.author}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(item)}
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}