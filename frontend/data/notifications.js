// Notification center data
export const mockNotifications = [
  {
    id: "1",
    type: "success",
    title: "Student Enrollment",
    message: "25 new students enrolled this week",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false
  },
  {
    id: "2", 
    type: "warning",
    title: "Faculty Meeting",
    message: "Department meeting scheduled for tomorrow at 10 AM",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false
  },
  {
    id: "3",
    type: "info", 
    title: "System Update",
    message: "Platform maintenance completed successfully",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true
  },
  {
    id: "4",
    type: "error",
    title: "Server Alert",
    message: "High server load detected in the evening",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true
  },
  {
    id: "5",
    type: "success",
    title: "Backup Complete",
    message: "Daily database backup completed",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    read: true
  }
];

// Recent activity data
export const mockActivities = [
  {
    id: "1",
    type: "enrollment",
    title: "New Student Enrolled",
    description: "John Doe joined AI & ML Department",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: "Admin"
  },
  {
    id: "2",
    type: "grade",
    title: "Grades Updated",
    description: "Semester 6 results published for CSE Department",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    user: "Prof. Amit"
  },
  {
    id: "3", 
    type: "faculty",
    title: "Faculty Profile Updated",
    description: "Dr. Rajesh Kumar updated research publications",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: "Dr. Rajesh"
  },
  {
    id: "4",
    type: "announcement",
    title: "New Announcement",
    description: "Tech Fest 2024 registration deadline extended",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: "Admin"
  }
];

// Helper functions
export const getUnreadNotifications = () => {
  return mockNotifications.filter(notification => !notification.read);
};

export const getNotificationIcon = (type) => {
  switch(type) {
    case "success": return "CheckCircle";
    case "warning": return "AlertTriangle"; 
    case "error": return "XCircle";
    case "info": return "Info";
    default: return "Bell";
  }
};

export const getActivityIcon = (type) => {
  switch(type) {
    case "enrollment": return "UserPlus";
    case "grade": return "BookOpen";
    case "faculty": return "User";
    case "announcement": return "Megaphone";
    default: return "Activity";
  }
};

export const getActivityBadgeVariant = (type) => {
  switch(type) {
    case "enrollment": return "default";
    case "grade": return "secondary";
    case "faculty": return "outline";
    case "announcement": return "destructive";
    default: return "default";
  }
};