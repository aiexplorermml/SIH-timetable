export interface Certificate {
  id: string;
  name: string;
  category: "Academic" | "Participation" | "Achievements" | "Certification";
  issuer: string;
  dateIssued: string;
  description?: string;
  certificateUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  regNo: string;
  department: string;
  section: string;
  year: number;
  contact: string;
  email?: string;
  status: "Current" | "Alumni";
  activities: string[];
  dob?: string;
  address?: string;
  cgpa?: number;
  subjects?: string[];
  graduationYear?: number;
  currentStatus?: string;
  profilePicture?: string;
  certificates?: Certificate[];
}