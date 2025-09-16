import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, X } from "lucide-react";
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
import { Student } from "@/types/student";

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rollNo: z.string().min(1, "Roll number is required"),
  regNo: z.string().min(1, "Registration number is required"),
  department: z.string().min(1, "Department is required"),
  section: z.string().min(1, "Section is required"),
  year: z.number().min(1).max(4),
  contact: z.string().min(10, "Contact must be at least 10 characters"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  status: z.enum(["Current", "Alumni"]),
  dob: z.string().optional(),
  address: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  graduationYear: z.number().optional(),
  currentStatus: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

// Sample student data (in real app, this would be fetched from API)
const sampleStudent: Student = {
  id: "1",
  name: "John Doe",
  rollNo: "CS2021001",
  regNo: "REG2021001",
  department: "Computer Science",
  section: "A",
  year: 3,
  contact: "+91 9876543210",
  email: "john.doe@college.edu",
  status: "Current",
  activities: ["coding", "sports", "music"],
  dob: "2003-05-15",
  address: "123 Main St, City, State",
  cgpa: 8.5,
  subjects: ["Data Structures", "Algorithms", "Database Systems"],
  currentStatus: "Active Student",
  profilePicture: undefined,
  certificates: []
};

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>(sampleStudent);
  const [activities, setActivities] = useState<string[]>(student.activities || []);
  const [subjects, setSubjects] = useState<string[]>(student.subjects || []);
  const [newActivity, setNewActivity] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student.name,
      rollNo: student.rollNo,
      regNo: student.regNo,
      department: student.department,
      section: student.section,
      year: student.year,
      contact: student.contact,
      email: student.email || "",
      status: student.status,
      dob: student.dob || "",
      address: student.address || "",
      cgpa: student.cgpa,
      graduationYear: student.graduationYear,
      currentStatus: student.currentStatus || "",
    },
  });

  const handleBack = () => {
    navigate(`/students/${id}`);
  };

  const handleProfilePictureUpdate = (imageUrl: string | null) => {
    setStudent(prev => ({
      ...prev,
      profilePicture: imageUrl || undefined
    }));
  };

  const addActivity = () => {
    if (newActivity.trim() && !activities.includes(newActivity.trim())) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity("");
    }
  };

  const removeActivity = (activity: string) => {
    setActivities(activities.filter(a => a !== activity));
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

  const onSubmit = (data: StudentFormData) => {
    // In real app, this would make an API call
    console.log("Updated student data:", { ...data, activities, subjects });
    
    toast({
      title: "Success",
      description: "Student details updated successfully!",
    });

    navigate(`/students/${id}`);
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
              <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
              <p className="text-muted-foreground">Update student information</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <ProfilePictureUpload
                  currentImage={student.profilePicture}
                  name={student.name}
                  onImageUpdate={handleProfilePictureUpdate}
                />
              </div>

              {/* Basic Details */}
              <div className="lg:col-span-2 space-y-6">
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
                        name="rollNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roll Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter roll number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="regNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter registration number" {...field} />
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
                        name="dob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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

                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1st Year</SelectItem>
                                <SelectItem value="2">2nd Year</SelectItem>
                                <SelectItem value="3">3rd Year</SelectItem>
                                <SelectItem value="4">4th Year</SelectItem>
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
                                <SelectItem value="Current">Current</SelectItem>
                                <SelectItem value="Alumni">Alumni</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cgpa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CGPA</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                min="0"
                                max="10"
                                placeholder="Enter CGPA" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="graduationYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Graduation Year</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter graduation year" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Extra-curricular Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add activity"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
                      />
                      <Button type="button" onClick={addActivity}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activities.map((activity, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          {activity}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeActivity(activity)}
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