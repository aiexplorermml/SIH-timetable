export interface Faculty {
  id: string;
  name: string;
  facultyId: string;
  department: string;
  qualification: string;
  contact: string;
  email?: string;
  status: "Active" | "Inactive";
  joiningDate?: string;
  experience?: number;
  specialization?: string[];
  subjects?: string[];
  address?: string;
  designations?: string[];
  degrees?: Degree[];
  research?: ResearchWork[];
  patents?: Patent[];
  leaveHistory?: LeaveRecord[];
  leaveBalance?: LeaveBalance;
  profilePicture?: string;
}

export interface Degree {
  title: string;
  institution: string;
  year: number;
  grade?: string;
}

export interface ResearchWork {
  id: string;
  title: string;
  type: "Research Paper" | "Conference" | "Book" | "Journal";
  year: number;
  status: "Published" | "Under Review" | "In Progress";
  journal?: string;
  coAuthors?: string[];
}

export interface Patent {
  id: string;
  title: string;
  patentNumber?: string;
  year: number;
  status: "Granted" | "Applied" | "Published";
  inventors?: string[];
}

export interface LeaveRecord {
  id: string;
  type: "Sick Leave" | "Casual Leave" | "Annual Leave" | "Maternity Leave" | "Sabbatical";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  appliedDate: string;
}

export interface LeaveBalance {
  sickLeave: number;
  casualLeave: number;
  annualLeave: number;
  totalAvailable: number;
}
