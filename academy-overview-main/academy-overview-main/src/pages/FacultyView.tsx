import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { getFacultyViewData } from "../../data/facultyViewData";
import { 
  ArrowLeft, 
  Edit, 
  Check, 
  X, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Download,
  CreditCard,
  Building
} from "lucide-react";

export function FacultyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty] = useState(() => getFacultyViewData(id));

  const handleApprove = () => {
    toast({
      title: "Faculty Approved",
      description: `${faculty.name} has been approved successfully.`
    });
  };

  const handleDeny = () => {
    toast({
      title: "Faculty Denied", 
      description: `${faculty.name} application has been denied.`,
      variant: "destructive"
    });
  };

  const handleRequestModifications = () => {
    toast({
      title: "Modifications Requested",
      description: `Modification request sent to ${faculty.name}.`
    });
  };

  const downloadDocument = (filename: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${filename}...`
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/admin/faculty-management")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty Management
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{faculty.name}</h1>
              <p className="text-muted-foreground">Faculty ID: {faculty.facultyId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/admin/faculty-management/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="default" onClick={handleApprove}>
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button variant="destructive" onClick={handleDeny}>
              <X className="h-4 w-4 mr-2" />
              Deny
            </Button>
            <Button variant="outline" onClick={handleRequestModifications}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Request Modifications
            </Button>
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={faculty.profilePicture} />
                <AvatarFallback>{faculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{faculty.name}</CardTitle>
                <CardDescription className="space-y-1">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    {faculty.department}
                  </div>
                  <Badge variant="secondary">{faculty.status}</Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{faculty.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{faculty.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p>{faculty.address.street}</p>
                  <p>{faculty.address.city}, {faculty.address.state}</p>
                  <p>{faculty.address.pincode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity & Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Identity & Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Aadhar Number</p>
                <p className="text-sm text-muted-foreground">{faculty.aadhar}</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto"
                  onClick={() => downloadDocument(faculty.documents.aadharProof)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Proof
                </Button>
              </div>
              <div>
                <p className="font-medium">PAN Number</p>
                <p className="text-sm text-muted-foreground">{faculty.pan}</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto"
                  onClick={() => downloadDocument(faculty.documents.panProof)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Proof
                </Button>
              </div>
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-muted-foreground">{faculty.bankDetails.accountNumber}</p>
                <p className="text-sm text-muted-foreground">{faculty.bankDetails.bankName} - {faculty.bankDetails.ifsc}</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto"
                  onClick={() => downloadDocument(faculty.documents.bankProof)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Proof
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2" />
              Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faculty.qualifications.map((qual, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{qual.degree}</h4>
                      <p className="text-sm text-muted-foreground">{qual.institution}</p>
                      <p className="text-sm">{qual.year} • {qual.grade}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadDocument(qual.certificate)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Certificate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Teaching Subjects
            </CardTitle>
            <CardDescription>Maximum 10 subjects allowed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {faculty.subjects.map((subject, index) => (
                <Badge key={index} variant="outline">{subject}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Teaching Experience */}
            <div>
              <h4 className="font-medium mb-3">Teaching Experience</h4>
              <div className="space-y-3">
                {faculty.experience.teaching.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h5 className="font-medium">{exp.role}</h5>
                    <p className="text-sm text-muted-foreground">{exp.institution} • {exp.duration}</p>
                    <p className="text-sm mt-1">{exp.description}</p>
                    {exp.attachment && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto mt-2"
                        onClick={() => downloadDocument(exp.attachment)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download Proof
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Industry Experience */}
            <div>
              <h4 className="font-medium mb-3">Industry Experience</h4>
              <div className="space-y-3">
                {faculty.experience.industry.map((exp, index) => (
                  <div key={index} className="border-l-2 border-secondary pl-4">
                    <h5 className="font-medium">{exp.role}</h5>
                    <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                    <p className="text-sm mt-1">{exp.description}</p>
                    {exp.attachment && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto mt-2"
                        onClick={() => downloadDocument(exp.attachment)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download Proof
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Research Experience */}
            <div>
              <h4 className="font-medium mb-3">Research Experience</h4>
              <div className="space-y-3">
                {faculty.experience.research.map((exp, index) => (
                  <div key={index} className="border-l-2 border-accent pl-4">
                    <h5 className="font-medium">{exp.role}</h5>
                    <p className="text-sm text-muted-foreground">{exp.institution} • {exp.duration}</p>
                    <p className="text-sm mt-1">{exp.description}</p>
                    {exp.attachment && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto mt-2"
                        onClick={() => downloadDocument(exp.attachment)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download Proof
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements & Publications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Publications */}
            <div>
              <h4 className="font-medium mb-3">Publications</h4>
              <div className="space-y-3">
                {faculty.achievements.publications.map((pub, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{pub.title}</h5>
                        <p className="text-sm text-muted-foreground">{pub.journal} • {pub.year} • {pub.type}</p>
                      </div>
                      {pub.attachment && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadDocument(pub.attachment)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Certifications */}
            <div>
              <h4 className="font-medium mb-3">Certifications</h4>
              <div className="space-y-3">
                {faculty.achievements.certifications.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{cert.name}</h5>
                        <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
                      </div>
                      {cert.attachment && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadDocument(cert.attachment)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Awards */}
            <div>
              <h4 className="font-medium mb-3">Awards</h4>
              <div className="space-y-3">
                {faculty.achievements.awards.map((award, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{award.name}</h5>
                        <p className="text-sm text-muted-foreground">{award.event} • {award.year}</p>
                      </div>
                      {award.attachment && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadDocument(award.attachment)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}