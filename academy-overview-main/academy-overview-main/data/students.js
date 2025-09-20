// Student data and distribution information
export const studentData = [
  { department: "AI & ML", firstYear: 120, secondYear: 115, thirdYear: 110, fourthYear: 105 },
  { department: "AI & DS", firstYear: 80, secondYear: 75, thirdYear: 70, fourthYear: 68 },
  { department: "CSE", firstYear: 150, secondYear: 145, thirdYear: 140, fourthYear: 135 },
  { department: "IT", firstYear: 100, secondYear: 95, thirdYear: 90, fourthYear: 88 },
  { department: "ECE", firstYear: 90, secondYear: 85, thirdYear: 80, fourthYear: 78 },
  { department: "EEE", firstYear: 70, secondYear: 68, thirdYear: 65, fourthYear: 62 },
  { department: "Mechanical", firstYear: 110, secondYear: 108, thirdYear: 105, fourthYear: 100 }
];

// Sample student records for detailed views
export const studentsData = [
  {
    id: "1",
    name: "John Doe",
    rollNumber: "AIML2021001",
    department: "AI & ML",
    year: "3rd Year",
    email: "john.doe@student.edu",
    phone: "+91 9876543210",
    status: "Active",
    gpa: 8.5,
    address: "123 Student Colony, City",
    dateOfBirth: "2003-05-15",
    guardianName: "Robert Doe",
    guardianContact: "+91 9876543211"
  },
  {
    id: "2", 
    name: "Jane Smith",
    rollNumber: "CSE2020002",
    department: "CSE",
    year: "4th Year", 
    email: "jane.smith@student.edu",
    phone: "+91 9876543212",
    status: "Active",
    gpa: 9.2,
    address: "456 University Road, City",
    dateOfBirth: "2002-08-22",
    guardianName: "Michael Smith",
    guardianContact: "+91 9876543213"
  },
  {
    id: "3",
    name: "Raj Patel",
    rollNumber: "ECE2021003",
    department: "ECE",
    year: "3rd Year",
    email: "raj.patel@student.edu", 
    phone: "+91 9876543214",
    status: "Active",
    gpa: 7.8,
    address: "789 Campus Street, City",
    dateOfBirth: "2003-01-10",
    guardianName: "Suresh Patel",
    guardianContact: "+91 9876543215"
  }
];

// Helper functions
export const getStudentsByDepartment = (department) => {
  return studentsData.filter(student => student.department === department);
};

export const getStudentById = (id) => {
  return studentsData.find(student => student.id === id);
};

export const getTotalStudentsByDepartment = () => {
  return studentData.map(dept => ({
    ...dept,
    total: dept.firstYear + dept.secondYear + dept.thirdYear + dept.fourthYear
  }));
};