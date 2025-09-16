// Quick actions configuration
export const quickActions = [
  {
    icon: "UserPlus",
    label: "Add Student",
    description: "Enroll new student",
    actionType: "student-enrollment"
  },
  {
    icon: "GraduationCap", 
    label: "Add Faculty",
    description: "Register new faculty member",
    actionType: "faculty-registration"
  },
  {
    icon: "BookOpen",
    label: "Create Subject",
    description: "Add new subject to curriculum",
    actionType: "subject-creation"
  },
  {
    icon: "Calendar",
    label: "Schedule Event",
    description: "Plan upcoming events",
    actionType: "event-scheduling"
  },
  {
    icon: "FileText",
    label: "Generate Report",
    description: "Create analytics report",
    actionType: "report-generation"
  },
  {
    icon: "Settings",
    label: "System Settings",
    description: "Configure platform settings",
    actionType: "system-settings"
  }
];

// Helper function to get action by type
export const getActionByType = (actionType) => {
  return quickActions.find(action => action.actionType === actionType);
};

// Navigation routes for actions
export const actionRoutes = {
  "student-enrollment": "/students/new",
  "faculty-registration": "/faculty-registration", 
  "subject-creation": "/admin/subjects/new",
  "event-scheduling": "/events/new",
  "report-generation": "/reports",
  "system-settings": "/settings"
};