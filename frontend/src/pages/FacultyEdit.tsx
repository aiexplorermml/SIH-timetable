import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { Faculty, Degree, ResearchWork } from "@/types/faculty";

const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  facultyId: z.string().min(1, "Faculty ID is required"),
  department: z.string().min(1, "Department is required"),
  qualification: z.string().min(1, "Qualification is required"),
  contact: z.string().min(10, "Contact must be at least 10 characters"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive"]),
  joiningDate: z.string().optional(),
  experience: z.number().min(0).optional(),
  address: z.string().optional(),
});

type FacultyFormData = z.infer<typeof facultySchema>;

// Sample faculty data
const sampleFaculty: Faculty = {
  id: "1",
  name: "Dr. Jane Smith",
  facultyId: "FAC001",
  department: "Computer Science",
  qualification: "Ph.D. in Computer Science",
  contact: "+91 9876543210",
  email: "jane.smith@college.edu",
  status: "Active",
  joiningDate: "2018-08-15",
  experience: 8,
  specialization: ["Machine Learning", "Data Science", "AI"],
  subjects: ["Data Structures", "Algorithms", "Machine Learning"],
  address: "456 Faculty St, Campus, State",
  designations: ["Assistant Professor", "Research Coordinator"],
  degrees: [
    {
      title: "Ph.D. in Computer Science",
      institution: "IIT Delhi",
      year: 2015,
      grade: "Excellent"
    },
    {
      title: "M.Tech in Computer Science",
      institution: "NIT Trichy",
      year: 2010,
      grade: "First Class"
    }
  ],
  research: [
    {
      id: "1",
      title: "Machine Learning in Healthcare",
      type: "Research Paper",
      year: 2023,
      status: "Published",
      journal: "IEEE Transactions on Medical Imaging",
      coAuthors: ["Dr. John Doe", "Dr. Mary Johnson"]
    }
  ],
  patents: [],
  profilePicture: undefined
};

export default function FacultyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState<Faculty>(sampleFaculty);
  const [specializations, setSpecializations] = useState<string[]>(faculty.specialization || []);
  const [subjects, setSubjects] = useState<string[]>(faculty.subjects || []);
  const [designations, setDesignations] = useState<string[]>(faculty.designations || []);
  const [degrees, setDegrees] = useState<Degree[]>(faculty.degrees || []);
  const [research, setResearch] = useState<ResearchWork[]>(faculty.research || []);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDesignation, setNewDesignation] = useState("");

  const form = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: faculty.name,
      facultyId: faculty.facultyId,
      department: faculty.department,
      qualification: faculty.qualification,
      contact: faculty.contact,
      email: faculty.email || "",
      status: faculty.status,
      joiningDate: faculty.joiningDate || "",
      experience: faculty.experience,
      address: faculty.address || "",
    },
  });

  const handleBack = () => {
    navigate(`/faculty/${id}`);
  };

  const handleProfilePictureUpdate = (imageUrl: string | null) => {
    setFaculty(prev => ({
      ...prev,
      profilePicture: imageUrl || undefined
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations(specializations.filter(s => s !== spec));
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const addDesignation = () => {
    if (newDesignation.trim() && !designations.includes(newDesignation.trim())) {
      setDesignations([...designations, newDesignation.trim()]);
      setNewDesignation("");
    }
  };

  const removeDesignation = (designation: string) => {
    setDesignations(designations.filter(d => d !== designation));
  };

  const addDegree = () => {
    setDegrees([...degrees, {
      title: "",
      institution: "",
      year: new Date().getFullYear(),
      grade: ""
    }]);
  };

  const updateDegree = (index: number, field: keyof Degree, value: string | number) => {
    const updatedDegrees = degrees.map((degree, i) => 
      i === index ? { ...degree, [field]: value } : degree
    );
    setDegrees(updatedDegrees);
  };

  const removeDegree = (index: number) => {
    setDegrees(degrees.filter((_, i) => i !== index));
  };

  const addResearch = () => {
    setResearch([...research, {
      id: Date.now().toString(),
      title: "",
      type: "Research Paper",
      year: new Date().getFullYear(),
      status: "In Progress",
      journal: "",
      coAuthors: []
    }]);
  };

  const updateResearch = (index: number, field: keyof ResearchWork, value: any) => {
    const updatedResearch = research.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setResearch(updatedResearch);
  };

  const removeResearch = (index: number) => {
    setResearch(research.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FacultyFormData) => {
    // In real app, this would make an API call
    console.log("Updated faculty data:", { 
      ...data, 
      specializations, 
      subjects, 
      designations,
      degrees,
      research
    });
    
    toast({
      title: "Success",
      description: "Faculty details updated successfully!",
    });

    navigate(`/faculty/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Details
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Faculty</h1>
              <p className="text-muted-foreground">Update faculty information</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <ProfilePictureUpload
                  currentImage={faculty.profilePicture}
                  name={faculty.name}
                  onImageUpdate={handleProfilePictureUpdate}
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="facultyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faculty ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter faculty ID" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter contact number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                                <SelectItem value="Mechanical">Mechanical</SelectItem>
                                <SelectItem value="Civil">Civil</SelectItem>
                                <SelectItem value="Chemical">Chemical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="joiningDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Joining Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience (Years)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter experience" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualification</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter qualification" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Specializations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Specializations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add specialization"
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                      />
                      <Button type="button" onClick={addSpecialization}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          {spec}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeSpecialization(spec)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Subjects */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subjects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add subject"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                      />
                      <Button type="button" onClick={addSubject}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="gap-2">
                          {subject}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeSubject(subject)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Designations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Designations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add designation"
                        value={newDesignation}
                        onChange={(e) => setNewDesignation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDesignation())}
                      />
                      <Button type="button" onClick={addDesignation}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {designations.map((designation, index) => (
                        <Badge key={index} variant="default" className="gap-2">
                          {designation}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeDesignation(designation)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Degrees */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Degrees
                      <Button type="button" size="sm" onClick={addDegree} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Degree
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {degrees.map((degree, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Degree {index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => removeDegree(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Degree title"
                            value={degree.title}
                            onChange={(e) => updateDegree(index, 'title', e.target.value)}
                          />
                          <Input
                            placeholder="Institution"
                            value={degree.institution}
                            onChange={(e) => updateDegree(index, 'institution', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Year"
                            value={degree.year}
                            onChange={(e) => updateDegree(index, 'year', parseInt(e.target.value))}
                          />
                          <Input
                            placeholder="Grade"
                            value={degree.grade || ''}
                            onChange={(e) => updateDegree(index, 'grade', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Research Work */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Research Work
                      <Button type="button" size="sm" onClick={addResearch} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Research
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {research.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Research {index + 1}</h4>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => removeResearch(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Research title"
                            value={item.title}
                            onChange={(e) => updateResearch(index, 'title', e.target.value)}
                          />
                          <Select 
                            value={item.type} 
                            onValueChange={(value) => updateResearch(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Research Paper">Research Paper</SelectItem>
                              <SelectItem value="Conference">Conference</SelectItem>
                              <SelectItem value="Book">Book</SelectItem>
                              <SelectItem value="Journal">Journal</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            placeholder="Year"
                            value={item.year}
                            onChange={(e) => updateResearch(index, 'year', parseInt(e.target.value))}
                          />
                          <Select 
                            value={item.status} 
                            onValueChange={(value) => updateResearch(index, 'status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Published">Published</SelectItem>
                              <SelectItem value="Under Review">Under Review</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Journal/Conference"
                            value={item.journal || ''}
                            onChange={(e) => updateResearch(index, 'journal', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}