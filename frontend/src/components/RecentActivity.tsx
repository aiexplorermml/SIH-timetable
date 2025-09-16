import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, UserPlus, BookOpen, Calendar, GraduationCap } from "lucide-react";

interface Activity {
  id: string;
  type: "enrollment" | "course" | "event" | "faculty";
  title: string;
  description: string;
  timestamp: Date;
  user: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "enrollment",
    title: "New Student Enrollment",
    description: "John Doe enrolled in Computer Science",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: "Admin"
  },
  {
    id: "2",
    type: "course",
    title: "Course Updated", 
    description: "Data Structures syllabus modified",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    user: "Dr. Smith"
  },
  {
    id: "3",
    type: "event",
    title: "Event Scheduled",
    description: "Annual Tech Fest planned for next month",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: "Event Team"
  },
  {
    id: "4",
    type: "faculty",
    title: "Faculty Assignment",
    description: "Prof. Johnson assigned to Advanced Algorithms",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: "Admin"
  }
];

export function RecentActivity() {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "enrollment":
        return <UserPlus className="h-4 w-4 text-primary" />;
      case "course":
        return <BookOpen className="h-4 w-4 text-secondary" />;
      case "event":
        return <Calendar className="h-4 w-4 text-warning" />;
      case "faculty":
        return <GraduationCap className="h-4 w-4 text-tertiary" />;
    }
  };

  const getBadgeVariant = (type: Activity["type"]) => {
    switch (type) {
      case "enrollment":
        return "default";
      case "course":
        return "secondary";
      case "event":
        return "outline";
      case "faculty":
        return "outline";
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <Card className="bg-gradient-card shadow-elegant border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  {getIcon(activity.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">
                        {activity.user.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}