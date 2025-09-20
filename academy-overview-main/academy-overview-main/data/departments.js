// Department definitions and navigation structure
export const departments = [
  { id: "aiml", name: "AI & ML", code: "AIML", fullName: "Artificial Intelligence & Machine Learning" },
  //{ id: "aids", name: "AI & DS", code: "AIDS", fullName: "Artificial Intelligence & Data Science" },
  //{ id: "cse", name: "CSE", code: "CSE", fullName: "Computer Science & Engineering" },
 // { id: "it", name: "IT", code: "IT", fullName: "Information Technology" },
  //{ id: "ece", name: "ECE", code: "ECE", fullName: "Electronics & Communication Engineering" },
 // { id: "eee", name: "EEE", code: "EEE", fullName: "Electrical & Electronics Engineering" },
 //{ id: "mech", name: "Mechanical", code: "MECH", fullName: "Mechanical Engineering" },
];

// Department navigation sections
export const departmentSections = [
  { title: "Dashboard", path: "", icon: "LayoutDashboard" },
  { title: "Faculty", path: "faculty", icon: "GraduationCap" },
  { title: "Sections", path: "sections", icon: "School" },
  { title: "Time Table", path: "timetable", icon: "Clock" },
  { 
    title: "Curriculum", 
    path: "curriculum", 
    icon: "BookOpen",
    subSections: [
      { title: "Subjects", path: "curriculum/subjects" },
      { title: "Subject Mapping", path: "curriculum/mapping" }
    ]
  },
  { title: "News & Events", path: "news", icon: "Newspaper" },
];

// Public navigation sections
export const publicSections = [
  { title: "Students", path: "students", icon: "Users" },
];

// Admin navigation sections
export const adminSections = [
  { title: "Subjects Management", path: "subjects", icon: "Book" },
  { title: "Faculty Management", path: "faculty-management", icon: "GraduationCap" },
  { title: "Semester Planning", path: "semester-planning", icon: "Calendar" },
  { title: "Rooms", path: "rooms", icon: "Building" }
];

// Department color mappings
export const departmentColors = {
  "AI & ML": "bg-blue-500",
  "AI & DS": "bg-purple-500", 
  "CSE": "bg-green-500",
  "IT": "bg-yellow-500",
  "ECE": "bg-red-500",
  "EEE": "bg-orange-500",
  "Mechanical": "bg-gray-500"
};

// Helper function to get department by ID
export const getDepartmentById = (id) => {
  return departments.find(dept => dept.id === id);
};

// Helper function to get department full name
export const getDepartmentFullName = (code) => {
  const dept = departments.find(d => d.code === code || d.name === code);
  return dept?.fullName || code;
};