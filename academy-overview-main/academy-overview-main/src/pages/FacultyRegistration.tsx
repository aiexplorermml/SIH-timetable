import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, X, FileText, GraduationCap, Briefcase, BookOpen, Award } from "lucide-react";

interface AcademicQualification {
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

interface Publication {
  title: string;
  type: string;
  year: string;
  journal: string;
}

interface Experience {
  organization: string;
  position: string;
  duration: string;
  responsibilities: string;
}

const subjectsList = [
  "Data Structures",
  "Algorithms",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Database Management",
  "Web Development",
  "Software Engineering",
  "Operating Systems"
];

export function FacultyRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    address: "",
    dateOfBirth: "",
    
    // Academic Qualifications
    qualifications: [] as AcademicQualification[],
    
    // Publications
    publications: [] as Publication[],
    
    // Professional Experience
    experiences: [] as Experience[],
    
    // Subjects
    selectedSubjects: [] as string[],
    
    // Documents
    documents: {
      resume: null as File | null,
      certificates: [] as File[],
      publications: [] as File[]
    }
  });

  const [newQualification, setNewQualification] = useState<AcademicQualification>({
    degree: "", institution: "", year: "", grade: ""
  });

  const [newPublication, setNewPublication] = useState<Publication>({
    title: "", type: "", year: "", journal: ""
  });

  const [newExperience, setNewExperience] = useState<Experience>({
    organization: "", position: "", duration: "", responsibilities: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQualification = () => {
    if (newQualification.degree && newQualification.institution && newQualification.year) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification]
      }));
      setNewQualification({ degree: "", institution: "", year: "", grade: "" });
      toast.success("Academic qualification added");
    }
  };

  const addPublication = () => {
    if (newPublication.title && newPublication.type && newPublication.year) {
      setFormData(prev => ({
        ...prev,
        publications: [...prev.publications, newPublication]
      }));
      setNewPublication({ title: "", type: "", year: "", journal: "" });
      toast.success("Publication added");
    }
  };

  const addExperience = () => {
    if (newExperience.organization && newExperience.position && newExperience.duration) {
      setFormData(prev => ({
        ...prev,
        experiences: [...prev.experiences, newExperience]
      }));
      setNewExperience({ organization: "", position: "", duration: "", responsibilities: "" });
      toast.success("Professional experience added");
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter(s => s !== subject)
        : [...prev.selectedSubjects, subject]
    }));
  };

  const handleFileUpload = (type: string, files: FileList | null) => {
    if (!files) return;
    
    if (type === "resume") {
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, resume: files[0] }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: [...prev.documents[type as keyof typeof prev.documents] as File[], ...Array.from(files)]
        }
      }));
    }
    toast.success(`${type} uploaded successfully`);
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const removePublication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    toast.success("Registration submitted successfully! Your application is under review.");
  };

  const renderPersonalInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Personal Information
        </CardTitle>
        <CardDescription>Your basic personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Address</Label>
          <Textarea
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Enter your complete address"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderAcademicQualifications = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Academic Qualifications
        </CardTitle>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Qualification */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add Qualification</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input
                value={newQualification.degree}
                onChange={(e) => setNewQualification(prev => ({ ...prev, degree: e.target.value }))}
                placeholder="e.g., M.Tech, Ph.D"
              />
            </div>
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input
                value={newQualification.institution}
                onChange={(e) => setNewQualification(prev => ({ ...prev, institution: e.target.value }))}
                placeholder="University/College name"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year of Completion</Label>
              <Input
                value={newQualification.year}
                onChange={(e) => setNewQualification(prev => ({ ...prev, year: e.target.value }))}
                placeholder="e.g., 2020"
              />
            </div>
            <div className="space-y-2">
              <Label>Grade/Percentage</Label>
              <Input
                value={newQualification.grade}
                onChange={(e) => setNewQualification(prev => ({ ...prev, grade: e.target.value }))}
                placeholder="e.g., First Class, 85%"
              />
            </div>
          </div>
          <Button onClick={addQualification} size="sm">
            Add Qualification
          </Button>
        </div>

        {/* Display Added Qualifications */}
        {formData.qualifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Added Qualifications</h4>
            {formData.qualifications.map((qual, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{qual.degree} - {qual.institution}</p>
                  <p className="text-sm text-muted-foreground">{qual.year} | {qual.grade}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeQualification(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPublications = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Publications & Research
        </CardTitle>
        <CardDescription>Add your publications and research work</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Publication */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add Publication</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newPublication.title}
                onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Publication title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newPublication.type} onValueChange={(value) => setNewPublication(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="journal">Journal Paper</SelectItem>
                    <SelectItem value="conference">Conference Paper</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="chapter">Book Chapter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={newPublication.year}
                  onChange={(e) => setNewPublication(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="Publication year"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Journal/Conference</Label>
              <Input
                value={newPublication.journal}
                onChange={(e) => setNewPublication(prev => ({ ...prev, journal: e.target.value }))}
                placeholder="Name of journal or conference"
              />
            </div>
          </div>
          <Button onClick={addPublication} size="sm">
            Add Publication
          </Button>
        </div>

        {/* Display Added Publications */}
        {formData.publications.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Added Publications</h4>
            {formData.publications.map((pub, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{pub.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {pub.type} | {pub.journal} | {pub.year}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removePublication(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderExperience = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Professional Experience
        </CardTitle>
        <CardDescription>Add your work experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Experience */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add Experience</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Organization</Label>
              <Input
                value={newExperience.organization}
                onChange={(e) => setNewExperience(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="Company/Institution name"
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                value={newExperience.position}
                onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Job title"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input
              value={newExperience.duration}
              onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 2018-2022"
            />
          </div>
          <div className="space-y-2">
            <Label>Key Responsibilities</Label>
            <Textarea
              value={newExperience.responsibilities}
              onChange={(e) => setNewExperience(prev => ({ ...prev, responsibilities: e.target.value }))}
              placeholder="Describe your key responsibilities"
              rows={3}
            />
          </div>
          <Button onClick={addExperience} size="sm">
            Add Experience
          </Button>
        </div>

        {/* Display Added Experience */}
        {formData.experiences.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Added Experience</h4>
            {formData.experiences.map((exp, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{exp.position} at {exp.organization}</p>
                  <p className="text-sm text-muted-foreground">{exp.duration}</p>
                  <p className="text-sm text-muted-foreground mt-1">{exp.responsibilities}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSubjects = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Subject Expertise
        </CardTitle>
        <CardDescription>Select subjects you have expertise in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {subjectsList.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.selectedSubjects.includes(subject)}
                onCheckedChange={() => handleSubjectToggle(subject)}
              />
              <Label className="text-sm">{subject}</Label>
            </div>
          ))}
        </div>

        {formData.selectedSubjects.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Subjects:</Label>
            <div className="flex flex-wrap gap-2">
              {formData.selectedSubjects.map((subject) => (
                <Badge key={subject} variant="secondary">{subject}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Supporting Documents
        </CardTitle>
        <CardDescription>Upload your supporting documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resume Upload */}
        <div className="space-y-2">
          <Label>Resume/CV *</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload("resume", e.target.files)}
              className="hidden"
              id="resume-upload"
            />
            <Label htmlFor="resume-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Upload Resume</span>
              </Button>
            </Label>
            {formData.documents.resume && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.documents.resume.name}
              </p>
            )}
          </div>
        </div>

        {/* Certificates Upload */}
        <div className="space-y-2">
          <Label>Educational Certificates</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={(e) => handleFileUpload("certificates", e.target.files)}
              className="hidden"
              id="certificates-upload"
            />
            <Label htmlFor="certificates-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Upload Certificates</span>
              </Button>
            </Label>
            {formData.documents.certificates.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.documents.certificates.length} file(s) uploaded
              </p>
            )}
          </div>
        </div>

        {/* Publications Upload */}
        <div className="space-y-2">
          <Label>Publication Documents</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={(e) => handleFileUpload("publications", e.target.files)}
              className="hidden"
              id="publications-upload"
            />
            <Label htmlFor="publications-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Upload Publications</span>
              </Button>
            </Label>
            {formData.documents.publications.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.documents.publications.length} file(s) uploaded
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const steps = [
    { number: 1, title: "Personal Info", component: renderPersonalInfo },
    { number: 2, title: "Academic", component: renderAcademicQualifications },
    { number: 3, title: "Publications", component: renderPublications },
    { number: 4, title: "Experience", component: renderExperience },
    { number: 5, title: "Subjects", component: renderSubjects },
    { number: 6, title: "Documents", component: renderDocuments }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Faculty Registration</h1>
            <p className="text-muted-foreground mt-2">
              Complete your faculty profile to begin the approval process
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.number 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "border-muted-foreground text-muted-foreground"
                }`}>
                  {step.number}
                </div>
                <span className="text-xs mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="mb-8">
            {steps[currentStep - 1].component()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="hover-scale">
                <Award className="h-4 w-4 mr-2" />
                Submit for Approval
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}