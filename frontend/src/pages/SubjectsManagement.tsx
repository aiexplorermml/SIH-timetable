import { useState } from "react";
import { Plus, Edit, Trash2, Book, Clock, FileText, ExternalLink, BookOpen } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import { subjects } from "../../data/subjects";

// Sample data for subjects and topics
const sampleSubjects = subjects;

// Form schemas
const subjectSchema = z.object({
  code: z.string().min(1, "Subject code is required"),
  name: z.string().min(1, "Subject name is required"),
  description: z.string().min(1, "Description is required"),
  credit: z.number().min(1, "Credits must be at least 1"),
  totalHours: z.number().min(0, "Total hours cannot be negative"),
  is_lab: z.boolean().default(false),
  prerequisites: z.array(z.string()).default([]),
});

const topicSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
  description: z.string().min(1, "Description is required"),
  theoryHours: z.number().min(0, "Theory hours cannot be negative"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;
type TopicFormData = z.infer<typeof topicSchema>;

export default function SubjectsManagement() {
  const [subjects, setSubjects] = useState(sampleSubjects);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  

  const subjectForm = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      credit: 1,
      totalHours: 0,
      is_lab: false,
      prerequisites: [],
    },
  });

  const topicForm = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: "",
      description: "",
      theoryHours: 0,
    },
  });

  const onSubjectSubmit = (data: SubjectFormData) => {
    if (editingSubject) {
      setSubjects(prev => prev.map(subject => 
        subject.id === editingSubject.id 
          ? { 
              ...subject, 
              code: data.code,
              name: data.name,
              description: data.description,
              credit: data.credit,
              totalHours: data.totalHours,
              is_lab: data.is_lab,
              prerequisites: (data.prerequisites || []).filter(id => id !== (editingSubject?.id ?? ""))
            }
          : subject
      ));
      toast.success("Subject updated successfully");
    } else {
      const newSubject = {
        id: Date.now().toString(),
        code: data.code,
        name: data.name,
        description: data.description,
        credit: data.credit,
        totalHours: data.totalHours,
        is_lab: data.is_lab,
        prerequisites: data.prerequisites || [],
        topics: []
      };
      setSubjects(prev => [...prev, newSubject]);
      toast.success("Subject added successfully");
    }
    setIsSubjectDialogOpen(false);
    setEditingSubject(null);
    subjectForm.reset();
  };

  const onTopicSubmit = (data: TopicFormData) => {
    if (!selectedSubject) return;

    const topicData = {
      id: editingTopic ? editingTopic.id : `${selectedSubject}-T${Date.now()}`,
      name: data.name,
      description: data.description,
      theoryHours: data.theoryHours,
    };

    if (editingTopic) {
      setSubjects(prev => prev.map(subject => 
        subject.id === selectedSubject
          ? {
              ...subject,
              topics: subject.topics.map(topic =>
                topic.id === editingTopic.id ? topicData : topic
              )
            }
          : subject
      ));
      toast.success("Topic updated successfully");
    } else {
      setSubjects(prev => prev.map(subject => 
        subject.id === selectedSubject
          ? { ...subject, topics: [...subject.topics, topicData] }
          : subject
      ));
      toast.success("Topic added successfully");
    }
    
    setIsTopicDialogOpen(false);
    setEditingTopic(null);
    topicForm.reset();
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubject(subject);
    subjectForm.setValue("code", subject.code);
    subjectForm.setValue("name", subject.name);
    subjectForm.setValue("description", subject.description);
    subjectForm.setValue("credit", subject.credit);
    subjectForm.setValue("totalHours", subject.totalHours);
    subjectForm.setValue("is_lab", subject.is_lab || false);
    subjectForm.setValue("prerequisites", subject.prerequisites || []);
    setIsSubjectDialogOpen(true);
  };

  const handleEditTopic = (topic: any) => {
    setEditingTopic(topic);
    topicForm.setValue("name", topic.name);
    topicForm.setValue("description", topic.description);
    topicForm.setValue("theoryHours", topic.theoryHours);
    setIsTopicDialogOpen(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => prev
      .map((subject) => ({
        ...subject,
        prerequisites: (subject.prerequisites || []).filter((id: string) => id !== subjectId),
      }))
      .filter(subject => subject.id !== subjectId)
    );
    toast.success("Subject deleted successfully");
  };

  const handleDeleteTopic = (topicId: string) => {
    if (!selectedSubject) return;
    setSubjects(prev => prev.map(subject => 
      subject.id === selectedSubject
        ? { ...subject, topics: subject.topics.filter(topic => topic.id !== topicId) }
        : subject
    ));
    toast.success("Topic deleted successfully");
  };


  const selectedSubjectData = subjects.find(subject => subject.id === selectedSubject);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subjects Management</h1>
            <p className="text-muted-foreground">
              Manage subjects, topics, and their associated content
            </p>
          </div>
          <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                <DialogDescription>
                  {editingSubject ? "Update the subject details" : "Create a new subject with topics and reference materials"}
                </DialogDescription>
              </DialogHeader>
              <Form {...subjectForm}>
                <form onSubmit={subjectForm.handleSubmit(onSubjectSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={subjectForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Code</FormLabel>
                          <FormControl>
                            <Input placeholder="CS101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={subjectForm.control}
                      name="credit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credits</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={subjectForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Introduction to Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={subjectForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the subject..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={subjectForm.control}
                      name="totalHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Hours</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={subjectForm.control}
                      name="is_lab"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Lab Subject</FormLabel>
                            <FormDescription>
                              Is this a laboratory subject?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={subjectForm.control}
                    name="prerequisites"
                    render={({ field }) => {
                      const options = subjects
                        .filter((s) => !editingSubject || s.id !== editingSubject.id)
                        .map((s) => ({ label: `${s.code} — ${s.name}`, value: s.id }));
                      return (
                        <FormItem>
                          <FormLabel>Pre-requisites</FormLabel>
                          <FormDescription>
                            Select one or more subjects that must be completed before enrolling.
                          </FormDescription>
                          <FormControl>
                            <MultiSelect
                              options={options}
                              value={field.value || []}
                              onChange={(vals) => field.onChange(vals)}
                              placeholder="Search subjects..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <DialogFooter>
                    <Button type="submit">{editingSubject ? "Update Subject" : "Add Subject"}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subjects List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Subjects
              </CardTitle>
              <CardDescription>
                Click on a subject to view and manage its topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {subjects.map((subject) => (
                <Card 
                  key={subject.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedSubject === subject.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{subject.code}</Badge>
                          <Badge variant="secondary">{subject.credit} Credits</Badge>
                          {subject.is_lab && <Badge variant="destructive">Lab</Badge>}
                        </div>
                        <h3 className="font-medium mb-1">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {subject.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Total: {subject.totalHours}h
                          </div>
                        </div>
                        {subject.prerequisites && subject.prerequisites.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border/50">
                            <div className="flex items-center gap-1 mb-1">
                              <BookOpen className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-medium text-muted-foreground">Prerequisites:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {subject.prerequisites.map((prereqId) => {
                                const prereq = subjects.find(s => s.id === prereqId);
                                return prereq ? (
                                  <Badge key={prereqId} variant="outline" className="text-xs px-1 py-0">
                                    {prereq.code}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSubject(subject);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubject(subject.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Topics Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Topics & Content
                  </CardTitle>
                  <CardDescription>
                    {selectedSubjectData 
                      ? `Managing topics for ${selectedSubjectData.name}`
                      : "Select a subject to manage its topics"
                    }
                  </CardDescription>
                </div>
                {selectedSubject && !selectedSubjectData?.is_lab && (
                  <Dialog open={isTopicDialogOpen} onOpenChange={setIsTopicDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Topic
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{editingTopic ? "Edit Topic" : "Add New Topic"}</DialogTitle>
                        <DialogDescription>
                          {editingTopic ? "Update the topic details" : "Add a new topic with reference materials"}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...topicForm}>
                        <form onSubmit={topicForm.handleSubmit(onTopicSubmit)} className="space-y-4">
                          <FormField
                            control={topicForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Topic Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Programming Fundamentals" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={topicForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Detailed description of the topic..."
                                    className="min-h-[80px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={topicForm.control}
                            name="theoryHours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Theory Hours</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button type="submit">{editingTopic ? "Update Topic" : "Add Topic"}</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedSubjectData ? (
                <div className="space-y-4">
                  {selectedSubjectData.is_lab ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>This is a lab subject. Lab subjects typically don't have separate topics.</p>
                    </div>
                  ) : selectedSubjectData.topics.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No Major Topics to cover</p>
                    </div>
                  ) : (
                    selectedSubjectData.topics.map((topic) => (
                      <Card key={topic.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{topic.name}</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {topic.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Theory: {topic.theoryHours}h
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditTopic(topic)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTopic(topic.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Book className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a subject from the left to view and manage its topics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}