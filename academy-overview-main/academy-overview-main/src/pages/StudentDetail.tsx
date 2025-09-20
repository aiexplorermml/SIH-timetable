import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, GraduationCap, Trophy, Award } from "lucide-react";
import { Student } from "@/types/student";

// Extended sample data for demonstration
const sampleStudentDetails: Student = {
  id: "1",
  name: "Aarav Sharma",
  rollNo: "CS21001",
  regNo: "21CSE001",
  department: "Computer Science",
  section: "A",
  year: 3,
  contact: "+91-9876543210",
  email: "aarav.sharma@college.edu",
  status: "Current",
  activities: ["technical", "sports"],
  dob: "2002-05-15",
  address: "123 Tech Street, Silicon Valley, Bangalore - 560001",
  cgpa: 8.7,
  subjects: [
    "Data Structures & Algorithms",
    "Database Management Systems", 
    "Computer Networks",
    "Software Engineering",
    "Machine Learning",
    "Web Development"
  ],
  graduationYear: 2025,
  currentStatus: "Final Year Student",
  certificates: [
    {
      id: "cert1",
      name: "Dean's List",
      category: "Academic",
      issuer: "College of Engineering",
      dateIssued: "2023-12-15",
      description: "Achieved top 10% academic performance"
    },
    {
      id: "cert2", 
      name: "Programming Contest Winner",
      category: "Achievements",
      issuer: "Tech Club",
      dateIssued: "2023-10-20",
      description: "First place in inter-college programming contest"
    },
    {
      id: "cert3",
      name: "AWS Cloud Practitioner",
      category: "Certification",
      issuer: "Amazon Web Services",
      dateIssued: "2023-08-10",
      description: "AWS Certified Cloud Practitioner certification"
    },
    {
      id: "cert4",
      name: "Tech Symposium Participation",
      category: "Participation",
      issuer: "Annual Tech Fest",
      dateIssued: "2023-03-15",
      description: "Participated in annual technical symposium"
    }
  ]
};

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, fetch student data based on ID
  const [student, setStudent] = useState<Student>(sampleStudentDetails);

  const handleEdit = () => {
    navigate(`/students/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/students");
  };

  const handleProfilePictureUpdate = (imageUrl: string | null) => {
    setStudent(prev => ({
      ...prev,
      profilePicture: imageUrl || undefined
    }));
  };

  const formatActivities = (activities: string[]) => {
    const activityMap: Record<string, string> = {
      technical: "Technical",
      sports: "Sports", 
      cultural: "Cultural"
    };
    return activities.map(activity => activityMap[activity] || activity);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back and Edit buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Student Details</h2>
              <p className="text-muted-foreground">
                Comprehensive information for {student.name}
              </p>
            </div>
          </div>
          
          <Button onClick={handleEdit} className="gap-2 bg-gradient-primary hover:opacity-90">
            <Edit className="h-4 w-4" />
            Edit Student
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Column */}
          <div className="lg:col-span-1">
            <ProfilePictureUpload
              currentImage={student.profilePicture}
              name={student.name}
              onImageUpdate={handleProfilePictureUpdate}
            />
          </div>

          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Details Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                    {student.name.charAt(0)}
                  </div>
                  Basic Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{student.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                    <p className="text-foreground font-medium">{student.rollNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                    <p className="text-foreground font-medium">{student.regNo}</p>
                  </div>
                  {student.dob && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-foreground font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(student.dob).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                    <div className="space-y-2 mt-1">
                      <p className="text-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {student.contact}
                      </p>
                      {student.email && (
                        <p className="text-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {student.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {student.address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-foreground flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        {student.address}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Details Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-foreground font-medium">{student.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Section</label>
                    <p className="text-foreground font-medium">{student.section}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Year</label>
                    <p className="text-foreground font-medium">{student.year}</p>
                  </div>
                  {student.cgpa && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CGPA</label>
                      <p className="text-foreground font-medium">{student.cgpa}/10.0</p>
                    </div>
                  )}
                </div>
                
                {student.subjects && student.subjects.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Subjects</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {student.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge variant={student.status === "Current" ? "default" : "secondary"}>
                    {student.status}
                  </Badge>
                  {student.currentStatus && (
                    <span className="text-muted-foreground">{student.currentStatus}</span>
                  )}
                </div>
                {student.status === "Alumni" && student.graduationYear && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground">Graduation Year</label>
                    <p className="text-foreground font-medium">{student.graduationYear}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alumni Information (if applicable) */}
            {student.status === "Alumni" && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Alumni Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Graduation Year</label>
                    <p className="text-foreground font-medium">{student.graduationYear}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                    <p className="text-foreground font-medium">{student.currentStatus}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activities Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Extra-curricular Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.activities.length > 0 ? (
                  <div className="space-y-3">
                    {formatActivities(student.activities).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="font-medium">{activity}</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No activities recorded</p>
                )}
              </CardContent>
            </Card>

            {/* Certificates Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificates & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {student.certificates && student.certificates.length > 0 ? (
                  <div className="space-y-4">
                    {student.certificates.map((certificate) => (
                      <div key={certificate.id} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{certificate.name}</h4>
                            <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {certificate.category}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(certificate.dateIssued).toLocaleDateString()}
                          </p>
                          {certificate.description && (
                            <p className="text-sm text-foreground">{certificate.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No certificates recorded</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}