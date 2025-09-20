import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  Save,
  Send,
  User,
  MapPin,
  CreditCard,
  GraduationCap,
  FileText,
  Briefcase,
  Award
} from "lucide-react";

const formSchema = z.object({
  // Personal Details
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  
  // Address
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  
  // Identity & Bank
  aadhar: z.string().min(12, "Aadhar number is required"),
  pan: z.string().min(10, "PAN number is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifsc: z.string().min(11, "IFSC code is required"),
  bankName: z.string().min(1, "Bank name is required"),
  branch: z.string().min(1, "Branch is required")
});

type FormData = z.infer<typeof formSchema>;

// Mock data - same as view page
const mockFacultyData = {
  id: "1",
  name: "Dr. John Doe",
  facultyId: "FAC001",
  email: "john.doe@college.edu",
  phone: "+91 9876543210",
  department: "AI & ML",
  profilePicture: "/placeholder.svg",
  
  address: {
    street: "123 Main Street",
    city: "Mumbai", 
    state: "Maharashtra",
    pincode: "400001"
  },
  
  aadhar: "1234-5678-9012",
  pan: "ABCDE1234F",
  bankDetails: {
    accountNumber: "1234567890",
    ifsc: "SBIN0001234",
    bankName: "State Bank of India",
    branch: "Mumbai Main Branch"
  },
  
  qualifications: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "IIT Mumbai",
      year: "2018",
      grade: "First Class"
    }
  ],
  
  subjects: [
    "Machine Learning",
    "Deep Learning", 
    "Python Programming"
  ],
  
  experience: {
    teaching: [
      {
        role: "Assistant Professor",
        institution: "ABC College",
        duration: "2018-2023",
        description: "Taught ML and AI courses",
        attachment: ""
      }
    ],
    industry: [],
    research: []
  },
  
  achievements: {
    publications: [],
    certifications: [],
    awards: []
  }
};

const availableSubjects = [
  "Machine Learning", "Deep Learning", "Python Programming", "Data Structures",
  "Artificial Intelligence", "Computer Networks", "Database Systems", "Operating Systems",
  "Software Engineering", "Web Development", "Mobile Development", "Cybersecurity",
  "Data Science", "Cloud Computing", "DevOps", "Blockchain"
];

export function FacultyEditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(mockFacultyData);
  const [qualifications, setQualifications] = useState(faculty.qualifications);
  const [selectedSubjects, setSelectedSubjects] = useState(faculty.subjects);
  const [teachingExp, setTeachingExp] = useState(faculty.experience.teaching);
  const [industryExp, setIndustryExp] = useState(faculty.experience.industry);
  const [researchExp, setResearchExp] = useState(faculty.experience.research);
  const [publications, setPublications] = useState(faculty.achievements.publications);
  const [certifications, setCertifications] = useState(faculty.achievements.certifications);
  const [awards, setAwards] = useState(faculty.achievements.awards);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: faculty.name,
      email: faculty.email,
      phone: faculty.phone,
      street: faculty.address.street,
      city: faculty.address.city,
      state: faculty.address.state,
      pincode: faculty.address.pincode,
      aadhar: faculty.aadhar,
      pan: faculty.pan,
      accountNumber: faculty.bankDetails.accountNumber,
      ifsc: faculty.bankDetails.ifsc,
      bankName: faculty.bankDetails.bankName,
      branch: faculty.bankDetails.branch
    }
  });

  const handleSave = (data: FormData) => {
    toast({
      title: "Changes Saved",
      description: "Faculty details have been saved successfully."
    });
  };

  const handleSubmitForApproval = (data: FormData) => {
    toast({
      title: "Submitted for Approval",
      description: "Faculty details have been submitted for approval."
    });
    navigate("/admin/faculty-management");
  };

  const handleCancel = () => {
    navigate(`/admin/faculty-management/${id}`);
  };

  const addQualification = () => {
    setQualifications([...qualifications, {
      degree: "",
      institution: "",
      year: "",
      grade: ""
    }]);
  };

  const removeQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else if (selectedSubjects.length < 10) {
      setSelectedSubjects([...selectedSubjects, subject]);
    } else {
      toast({
        title: "Maximum subjects reached",
        description: "A faculty can teach maximum 10 subjects.",
        variant: "destructive"
      });
    }
  };

  const addExperience = (type: 'teaching' | 'industry' | 'research') => {
    const newExp = { role: "", institution: "", duration: "", description: "", attachment: "" };
    if (type === 'teaching') {
      setTeachingExp([...teachingExp, { ...newExp, institution: newExp.institution }]);
    } else if (type === 'industry') {
      setIndustryExp([...industryExp, { ...newExp, company: newExp.institution }]);
    } else {
      setResearchExp([...researchExp, { ...newExp, institution: newExp.institution }]);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to View
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Faculty Details</h1>
              <p className="text-muted-foreground">Faculty ID: {faculty.facultyId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={form.handleSubmit(handleSave)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={form.handleSubmit(handleSubmitForApproval)}>
              <Send className="h-4 w-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={faculty.profilePicture} />
                    <AvatarFallback>{faculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Picture
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Address Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="aadhar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Number *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-3 w-3 mr-1" />
                            Upload Aadhar Proof
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-3 w-3 mr-1" />
                            Upload PAN Proof
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ifsc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Bank Proof
                  </Button>
                </div>
            </CardContent>
            </Card>

            {/* Industry Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Industry Experience
                  </div>
                  <Button type="button" variant="outline" onClick={() => addExperience('industry')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {industryExp.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Industry Experience {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIndustryExp(industryExp.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Role *</Label>
                        <Input placeholder="e.g., Data Scientist" />
                      </div>
                      <div>
                        <Label>Company *</Label>
                        <Input placeholder="e.g., Tech Corp" />
                      </div>
                      <div>
                        <Label>Duration *</Label>
                        <Input placeholder="e.g., 2016-2018" />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Brief description of responsibilities..." />
                    </div>
                    <div>
                      <Label>Attachment (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Proof
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Research Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Research Experience
                  </div>
                  <Button type="button" variant="outline" onClick={() => addExperience('research')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {researchExp.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Research Experience {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => setResearchExp(researchExp.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Role *</Label>
                        <Input placeholder="e.g., Research Associate" />
                      </div>
                      <div>
                        <Label>Institution *</Label>
                        <Input placeholder="e.g., IIT Mumbai" />
                      </div>
                      <div>
                        <Label>Duration *</Label>
                        <Input placeholder="e.g., 2014-2016" />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Brief description of research work..." />
                    </div>
                    <div>
                      <Label>Attachment (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Proof
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Publications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Publications
                  </div>
                  <Button type="button" variant="outline" onClick={() => setPublications([...publications, { title: "", journal: "", year: "", type: "", attachment: "" }])}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Publication
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {publications.map((pub, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Publication {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => setPublications(publications.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Title *</Label>
                        <Input placeholder="e.g., Deep Learning for Computer Vision" />
                      </div>
                      <div>
                        <Label>Journal/Conference *</Label>
                        <Input placeholder="e.g., IEEE Transactions on AI" />
                      </div>
                      <div>
                        <Label>Year *</Label>
                        <Input placeholder="e.g., 2022" />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="journal">Journal</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                            <SelectItem value="book">Book</SelectItem>
                            <SelectItem value="chapter">Book Chapter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Attachment (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Publication
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Certifications
                  </div>
                  <Button type="button" variant="outline" onClick={() => setCertifications([...certifications, { name: "", issuer: "", year: "", attachment: "" }])}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Certification {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Certification Name *</Label>
                        <Input placeholder="e.g., AWS Machine Learning Specialty" />
                      </div>
                      <div>
                        <Label>Issuer *</Label>
                        <Input placeholder="e.g., Amazon" />
                      </div>
                      <div>
                        <Label>Year *</Label>
                        <Input placeholder="e.g., 2023" />
                      </div>
                    </div>
                    <div>
                      <Label>Attachment (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Certificate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Awards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Awards
                  </div>
                  <Button type="button" variant="outline" onClick={() => setAwards([...awards, { name: "", event: "", year: "", attachment: "" }])}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {awards.map((award, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Award {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => setAwards(awards.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Award Name *</Label>
                        <Input placeholder="e.g., Best Paper Award" />
                      </div>
                      <div>
                        <Label>Event/Organization *</Label>
                        <Input placeholder="e.g., ICML 2022" />
                      </div>
                      <div>
                        <Label>Year *</Label>
                        <Input placeholder="e.g., 2022" />
                      </div>
                    </div>
                    <div>
                      <Label>Attachment (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Award Certificate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Qualifications
                  </div>
                  <Button type="button" variant="outline" onClick={addQualification}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Qualification
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualifications.map((qual, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Qualification {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeQualification(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree *</Label>
                        <Input 
                          value={qual.degree}
                          onChange={(e) => {
                            const updated = [...qualifications];
                            updated[index].degree = e.target.value;
                            setQualifications(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Institution *</Label>
                        <Input 
                          value={qual.institution}
                          onChange={(e) => {
                            const updated = [...qualifications];
                            updated[index].institution = e.target.value;
                            setQualifications(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Year *</Label>
                        <Input 
                          value={qual.year}
                          onChange={(e) => {
                            const updated = [...qualifications];
                            updated[index].year = e.target.value;
                            setQualifications(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Grade/CGPA</Label>
                        <Input 
                          value={qual.grade}
                          onChange={(e) => {
                            const updated = [...qualifications];
                            updated[index].grade = e.target.value;
                            setQualifications(updated);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload Certificate
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Teaching Subjects
                </CardTitle>
                <CardDescription>Select maximum 10 subjects (Currently: {selectedSubjects.length}/10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableSubjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={() => toggleSubject(subject)}
                        disabled={!selectedSubjects.includes(subject) && selectedSubjects.length >= 10}
                      />
                      <Label htmlFor={subject} className="text-sm">{subject}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience Section - Teaching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Teaching Experience
                  </div>
                  <Button type="button" variant="outline" onClick={() => addExperience('teaching')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teachingExp.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Teaching Experience {index + 1}</h4>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => setTeachingExp(teachingExp.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Role *</Label>
                        <Input value={exp.role} placeholder="e.g., Assistant Professor" />
                      </div>
                      <div>
                        <Label>Institution *</Label>
                        <Input value={exp.institution} placeholder="e.g., ABC College" />
                      </div>
                      <div>
                        <Label>Duration *</Label>
                        <Input value={exp.duration} placeholder="e.g., 2018-2023" />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={exp.description} placeholder="Brief description of responsibilities..." />
                    </div>
                    <div>
                      <Label>Attachment (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Proof
                        </Button>
                        {exp.attachment && (
                          <span className="text-sm text-muted-foreground">{exp.attachment}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save/Submit Buttons */}
            <div className="flex justify-end space-x-2 pt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={form.handleSubmit(handleSave)}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmitForApproval)}>
                <Send className="h-4 w-4 mr-2" />
                Submit for Approval
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}