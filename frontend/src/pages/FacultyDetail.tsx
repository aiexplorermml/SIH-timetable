
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, GraduationCap, FileText, Award, Clock } from "lucide-react";
import type { Faculty } from "@/types/faculty";
import { getFacultyById } from "@/data/facultyData";

export default function FacultyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get faculty data from centralized source
  const facultyData = getFacultyById(id || "");
  const [faculty, setFaculty] = useState<Faculty | undefined>(facultyData);

  const handleEdit = () => {
    navigate(`/faculty/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/faculty");
  };

  const handleProfilePictureUpdate = (imageUrl: string | null) => {
    if (faculty) {
      setFaculty(prev => prev ? ({
        ...prev,
        profilePicture: imageUrl || undefined
      }) : prev);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": case "Granted": case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Under Review": case "Applied": case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  if (!faculty) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Faculty member not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back and Edit buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Faculty
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Faculty Details</h2>
              <p className="text-muted-foreground">
                Comprehensive profile for {faculty.name}
              </p>
            </div>
          </div>
          
          <Button onClick={handleEdit} className="gap-2 bg-gradient-primary hover:opacity-90">
            <Edit className="h-4 w-4" />
            Edit Faculty
          </Button>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <ProfilePictureUpload
              currentImage={faculty.profilePicture}
              name={faculty.name}
              onImageUpdate={handleProfilePictureUpdate}
            />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Information Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                    {faculty.name.charAt(0)}
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{faculty.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Faculty ID</label>
                    <p className="text-foreground font-medium font-mono bg-secondary/30 px-2 py-1 rounded text-sm">
                      {faculty.facultyId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-foreground font-medium">{faculty.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={faculty.status === "Active" ? "default" : "secondary"}>
                      {faculty.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                    <div className="space-y-2 mt-1">
                      <p className="text-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {faculty.contact}
                      </p>
                      {faculty.email && (
                        <p className="text-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {faculty.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {faculty.address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-foreground flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        {faculty.address}
                      </p>
                    </div>
                  )}

                  {faculty.joiningDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Joining Date</label>
                      <p className="text-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(faculty.joiningDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {faculty.experience && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Experience</label>
                      <p className="text-foreground font-medium">{faculty.experience} years</p>
                    </div>
                  )}
                </div>

                {faculty.designations && faculty.designations.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Designations</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {faculty.designations.map((designation, index) => (
                        <Badge key={index} variant="outline">
                          {designation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Qualification Details Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Qualification Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faculty.degrees && faculty.degrees.length > 0 ? (
                  <div className="space-y-4">
                    {faculty.degrees.map((degree, index) => (
                      <div key={index} className="p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold text-foreground">{degree.title}</h4>
                        <p className="text-muted-foreground text-sm">{degree.institution}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">Year: {degree.year}</span>
                          {degree.grade && (
                            <Badge variant="outline">{degree.grade}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No qualification details available</p>
                )}

                {faculty.specialization && faculty.specialization.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Specializations</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {faculty.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {faculty.subjects && faculty.subjects.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Teaching Subjects</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {faculty.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">
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
            {/* Research & Patents Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Research & Publications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faculty.research && faculty.research.length > 0 ? (
                  <div className="space-y-3">
                    {faculty.research.map((research) => (
                      <div key={research.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">{research.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {research.type} • {research.year}
                              {research.journal && ` • ${research.journal}`}
                            </p>
                            {research.coAuthors && research.coAuthors.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Co-authors: {research.coAuthors.join(", ")}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className={getStatusColor(research.status)}>
                            {research.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No research publications available</p>
                )}

                {faculty.patents && faculty.patents.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4" />
                      Patents
                    </h4>
                    <div className="space-y-3">
                      {faculty.patents.map((patent) => (
                        <div key={patent.id} className="p-3 border border-border rounded-lg">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-foreground text-sm">{patent.title}</h5>
                              <p className="text-xs text-muted-foreground mt-1">
                                {patent.year}
                                {patent.patentNumber && ` • ${patent.patentNumber}`}
                              </p>
                              {patent.inventors && patent.inventors.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Inventors: {patent.inventors.join(", ")}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className={getStatusColor(patent.status)}>
                              {patent.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leave Management Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Leave Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faculty.leaveBalance && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Leave Balance</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-secondary/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary">{faculty.leaveBalance.sickLeave}</p>
                        <p className="text-xs text-muted-foreground">Sick Leave</p>
                      </div>
                      <div className="p-3 bg-secondary/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary">{faculty.leaveBalance.casualLeave}</p>
                        <p className="text-xs text-muted-foreground">Casual Leave</p>
                      </div>
                      <div className="p-3 bg-secondary/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary">{faculty.leaveBalance.annualLeave}</p>
                        <p className="text-xs text-muted-foreground">Annual Leave</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary">{faculty.leaveBalance.totalAvailable}</p>
                        <p className="text-xs text-muted-foreground">Total Available</p>
                      </div>
                    </div>
                  </div>
                )}

                {faculty.leaveHistory && faculty.leaveHistory.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Recent Leave History</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {faculty.leaveHistory.slice(0, 5).map((leave) => (
                        <div key={leave.id} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {leave.type}
                                </Badge>
                                <span className="text-sm font-medium">{leave.days} day(s)</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">{leave.reason}</p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(leave.status)}>
                              {leave.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
