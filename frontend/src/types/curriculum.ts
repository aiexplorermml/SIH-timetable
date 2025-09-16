export interface SubTopic {
  id: string;
  name: string;
  theoryHours: number;
  practicalHours: number;
  description?: string;
  learningOutcomes?: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  totalTheoryHours: number;
  totalPracticalHours: number;
  description?: string;
  prerequisites?: string[];
  subTopics: SubTopic[];
  assessmentPattern?: {
    internalMarks: number;
    externalMarks: number;
    practicalMarks?: number;
  };
}

export interface SubjectMapping {
  id: string;
  subjectId: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  academicYear: string;
  isElective: boolean;
  maxStudents?: number;
  isActive: boolean;
}

export interface FacultyAssignment {
  id: string;
  facultyId: string;
  facultyName: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  departmentId: string;
  semester: number;
  academicYear: string;
  assignedHours: number;
  type: "Theory" | "Practical" | "Both";
  startDate: string;
  endDate: string;
}

export interface TimeSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

export interface FacultySchedule {
  facultyId: string;
  facultyName: string;
  assignments: Array<{
    assignmentId: string;
    subjectCode: string;
    subjectName: string;
    timeSlot: TimeSlot;
    department: string;
    semester: number;
    type: "Theory" | "Practical";
    venue?: string;
  }>;
  totalHours: number;
  maxHours: number;
  occupancyPercentage: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  totalSemesters: number;
}