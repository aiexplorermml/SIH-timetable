import { useState } from "react";
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Trash2,
  Edit,
  Table,
  Grid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { SemesterView } from "@/components/SemesterView";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { subjects } from "../../data/subjects";
import { subjectMapping } from "../../data/subjectMapping.js";

// Sample data sources
const availableSubjects = subjects; // expects objects with id, code, name, credits, theoryHours?, practicalHours?
const sampleMappings = subjectMapping; // existing mapping items (assumed individual mappings)

/* -----------------------------
   Schemas
   ----------------------------- */
const mappingSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  semester: z.number().min(1).max(8),
  academicYear: z.string().min(1),
  isElective: z.boolean().default(false),
  maxStudents: z.number().min(1).optional(),
});

const electiveGroupSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  subjectIds: z.array(z.string()).min(2, "At least 2 subjects required"),
  semester: z.number().min(1).max(8),
  academicYear: z.string().min(1),
  maxStudents: z.number().min(1).optional(),
});

type MappingFormData = z.infer<typeof mappingSchema>;
type ElectiveGroupFormData = z.infer<typeof electiveGroupSchema>;

/* -----------------------------
   Types
   ----------------------------- */
interface ExtendedMapping {
  id: string;
  type: "individual" | "group";
  // individual
  subjectId?: string;
  subjectCode?: string;
  subjectName?: string;
  // group
  groupName?: string;
  subjects?: Array<{
    id: string;
    code: string;
    name: string;
    credits?: number;
    theoryHours?: number;
    practicalHours?: number;
  }>;
  maxTheoryHours?: number;
  maxPracticalHours?: number;
  // common
  departmentId: string;
  departmentName: string;
  semester: number;
  academicYear: string;
  isElective: boolean;
  maxStudents: number;
  isActive: boolean;
}

/* -----------------------------
   Component
   ----------------------------- */
export default function SubjectMapping() {
  // initialize sample mappings as individual entries
  const initialMappings: ExtendedMapping[] = (sampleMappings || []).map((m: any) => ({
    ...m,
    type: "individual" as const,
    departmentId: m.departmentId ?? "aiml",
    departmentName: m.departmentName ?? "AI & ML",
    isActive: typeof m.isActive === "boolean" ? m.isActive : true,
    maxStudents: m.maxStudents ?? 60,
  }));

  const [mappings, setMappings] = useState<ExtendedMapping[]>(initialMappings);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectSearchTerm, setSubjectSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ExtendedMapping | null>(null);
  const [activeView, setActiveView] = useState<"list" | "semester">("semester");
  const [electiveGroupMode, setElectiveGroupMode] = useState(false);
  const [selectedElectives, setSelectedElectives] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // forms
  const form = useForm<MappingFormData>({
    resolver: zodResolver(mappingSchema),
    defaultValues: {
      subjectId: "",
      semester: 1,
      academicYear: "2024-25",
      isElective: false,
      maxStudents: 60,
    },
  });

  const groupForm = useForm<ElectiveGroupFormData>({
    resolver: zodResolver(electiveGroupSchema),
    defaultValues: {
      groupName: "",
      subjectIds: [],
      semester: 1,
      academicYear: "2024-25",
      maxStudents: 60,
    },
  });

  /* -----------------------------
     Filters
     ----------------------------- */
  const filteredAvailableSubjects = availableSubjects.filter((subject) => {
    // exclude subjects already mapped to the same semester & year (either as individual or inside groups)
    const alreadyMapped = mappings.some((mapping) => {
      if (mapping.type === "individual") {
        return (
          mapping.subjectId === subject.id &&
          mapping.academicYear === form.watch("academicYear") &&
          mapping.semester === form.watch("semester")
        );
      } else {
        return (
          mapping.subjects?.some((s) => s.id === subject.id) &&
          mapping.academicYear === form.watch("academicYear") &&
          mapping.semester === form.watch("semester")
        );
      }
    });

    const matchesSearch =
      subject.name.toLowerCase().includes(subjectSearchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(subjectSearchTerm.toLowerCase());

    return !alreadyMapped && matchesSearch;
  });

  const filteredMappings = mappings.filter((mapping) => {
    const s = searchTerm.toLowerCase();
    if (mapping.type === "individual") {
      return (
        (mapping.subjectName || "").toLowerCase().includes(s) ||
        (mapping.subjectCode || "").toLowerCase().includes(s) ||
        mapping.semester.toString().includes(searchTerm)
      );
    } else {
      return (
        (mapping.groupName || "").toLowerCase().includes(s) ||
        mapping.subjects?.some(
          (sub) =>
            sub.name.toLowerCase().includes(s) ||
            sub.code.toLowerCase().includes(s)
        ) ||
        mapping.semester.toString().includes(searchTerm)
      );
    }
  });

  /* -----------------------------
     Handlers
     ----------------------------- */

  // single mapping create/update
  const onSubmit = (data: MappingFormData) => {
    const subj = availableSubjects.find((s) => s.id === data.subjectId);
    if (!subj) {
      toast.error("Select a valid subject");
      return;
    }

    if (editingMapping && editingMapping.type === "individual") {
      setMappings((prev) =>
        prev.map((m) =>
          m.id === editingMapping.id
            ? {
                ...m,
                subjectId: data.subjectId,
                subjectCode: subj.code,
                subjectName: subj.name,
                semester: data.semester,
                academicYear: data.academicYear,
                isElective: data.isElective,
                maxStudents: data.maxStudents || 60,
              }
            : m
        )
      );
      toast.success("Mapping updated");
    } else {
      const newMap: ExtendedMapping = {
        id: Date.now().toString(),
        type: "individual",
        subjectId: subj.id,
        subjectCode: subj.code,
        subjectName: subj.name,
        departmentId: "aiml",
        departmentName: "AI & ML",
        semester: data.semester,
        academicYear: data.academicYear,
        isElective: data.isElective,
        maxStudents: data.maxStudents || 60,
        isActive: true,
      };
      setMappings((prev) => [...prev, newMap]);
      toast.success("Subject mapped");
    }

    setIsDialogOpen(false);
    setEditingMapping(null);
    form.reset();
  };

  // group create/update via group dialog
  const onGroupSubmit = (data: ElectiveGroupFormData) => {
    // build subject objects
    const selectedSubjects = availableSubjects.filter((s) => data.subjectIds.includes(s.id))
      .map((s) => ({
        id: s.id,
        code: s.code,
        name: s.name,
        credits: s.credits,
        theoryHours: s.theoryHours,
        practicalHours: s.practicalHours,
      }));

    if (selectedSubjects.length < 2) {
      toast.error("Select at least 2 subjects");
      return;
    }

    const maxTheoryHours = Math.max(...selectedSubjects.map((s) => s.theoryHours || 0));
    const maxPracticalHours = Math.max(...selectedSubjects.map((s) => s.practicalHours || 0));

    if (editingMapping && editingMapping.type === "group") {
      // update existing group
      setMappings((prev) =>
        prev.map((m) =>
          m.id === editingMapping.id
            ? {
                ...m,
                groupName: data.groupName,
                subjects: selectedSubjects,
                semester: data.semester,
                academicYear: data.academicYear,
                maxTheoryHours,
                maxPracticalHours,
                maxStudents: data.maxStudents || 60,
              }
            : m
        )
      );
      toast.success("Elective group updated");
    } else {
      // create new group and remove individual mappings for selected subjects (if any)
      const newGroup: ExtendedMapping = {
        id: Date.now().toString(),
        type: "group",
        groupName: data.groupName,
        subjects: selectedSubjects,
        departmentId: "aiml",
        departmentName: "AI & ML",
        semester: data.semester,
        academicYear: data.academicYear,
        isElective: true,
        maxTheoryHours,
        maxPracticalHours,
        maxStudents: data.maxStudents || 60,
        isActive: true,
      };

      setMappings((prev) => [
        ...prev.filter((m) => !(m.type === "individual" && data.subjectIds.includes(m.subjectId || ""))),
        newGroup,
      ]);
      toast.success("Elective group created");
    }

    setIsGroupDialogOpen(false);
    setEditingMapping(null);
    setSelectedElectives([]);
    groupForm.reset();
  };

  // create group from list mode (select checkboxes in list then create)
  const createElectiveGroupFromList = () => {
    if (selectedElectives.length < 2) {
      toast.error("Please select at least 2 subjects to create a group");
      return;
    }

    // ensure selected items are mapped individuals and get their mapping for semester/year
    const firstMapping = mappings.find((m) => m.type === "individual" && m.subjectId === selectedElectives[0]);
    if (!firstMapping) {
      toast.error("Selected subjects need to be mapped currently as individual mappings");
      return;
    }

    const selectedSubjects = availableSubjects.filter((s) => selectedElectives.includes(s.id))
      .map((s) => ({
        id: s.id,
        code: s.code,
        name: s.name,
        credits: s.credits,
        theoryHours: s.theoryHours,
        practicalHours: s.practicalHours,
      }));

    const maxTheoryHours = Math.max(...selectedSubjects.map((s) => s.theoryHours || 0));
    const maxPracticalHours = Math.max(...selectedSubjects.map((s) => s.practicalHours || 0));

    const newGroup: ExtendedMapping = {
      id: Date.now().toString(),
      type: "group",
      groupName: `Elective Group - Sem ${firstMapping.semester}`,
      subjects: selectedSubjects,
      departmentId: "aiml",
      departmentName: "AI & ML",
      semester: firstMapping.semester,
      academicYear: firstMapping.academicYear,
      isElective: true,
      maxTheoryHours,
      maxPracticalHours,
      maxStudents: 60,
      isActive: true,
    };

    setMappings((prev) => [
      ...prev.filter((m) => !(m.type === "individual" && selectedElectives.includes(m.subjectId || ""))),
      newGroup,
    ]);

    setSelectedElectives([]);
    setElectiveGroupMode(false);
    toast.success("Elective group created");
  };

  const handleEdit = (mapping: ExtendedMapping) => {
    setEditingMapping(mapping);
    if (mapping.type === "individual") {
      form.setValue("subjectId", mapping.subjectId || "");
      form.setValue("semester", mapping.semester);
      form.setValue("academicYear", mapping.academicYear);
      form.setValue("isElective", mapping.isElective);
      form.setValue("maxStudents", mapping.maxStudents);
      setIsDialogOpen(true);
    } else {
      groupForm.setValue("groupName", mapping.groupName || "");
      groupForm.setValue("subjectIds", mapping.subjects?.map((s) => s.id) || []);
      groupForm.setValue("semester", mapping.semester);
      groupForm.setValue("academicYear", mapping.academicYear);
      groupForm.setValue("maxStudents", mapping.maxStudents);
      setIsGroupDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
    toast.success("Deleted");
  };

  const toggleMappingStatus = (id: string) => {
    setMappings((prev) => prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)));
  };

  const toggleGroupExpansion = (id: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleElectiveToggle = (id: string) => {
    setSelectedElectives((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header + actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subject Mapping</h1>
            <p className="text-muted-foreground">Map subjects and elective groups to department semesters</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button variant={activeView === "semester" ? "default" : "ghost"} size="sm" onClick={() => setActiveView("semester")} className="gap-2">
                <Table className="h-4 w-4" /> Semester View
              </Button>
              <Button variant={activeView === "list" ? "default" : "ghost"} size="sm" onClick={() => setActiveView("list")} className="gap-2">
                <Grid className="h-4 w-4" /> List View
              </Button>
            </div>

            {electiveGroupMode ? (
              <div className="flex items-center gap-2">
                <Button onClick={createElectiveGroupFromList} disabled={selectedElectives.length < 2} className="gap-2">
                  <Users className="h-4 w-4" /> Create Group ({selectedElectives.length})
                </Button>
                <Button variant="outline" onClick={() => { setElectiveGroupMode(false); setSelectedElectives([]); }}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setElectiveGroupMode(true)}>
                <Users className="h-4 w-4" /> Group Electives
              </Button>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" /> Map Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingMapping?.type === "individual" ? "Edit Subject Mapping" : "Map Subject to Semester"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="subjectId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredAvailableSubjects.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.code} - {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="semester" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select value={field.value.toString()} onValueChange={(v) => field.onChange(parseInt(v))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8].map((sem) => (
                                <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="academicYear" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <Input {...field} />
                        </FormItem>
                      )} />
                    </div>

                    <DialogFooter>
                      <Button type="submit">{editingMapping ? "Update" : "Save"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Group Dialog */}
            <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingMapping?.type === "group" ? "Edit Elective Group" : "Create Elective Group"}</DialogTitle>
                </DialogHeader>

                <Form {...groupForm}>
                  <form onSubmit={groupForm.handleSubmit(onGroupSubmit)} className="space-y-4">
                    <FormField control={groupForm.control} name="groupName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={groupForm.control} name="subjectIds" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose Subjects (min 2)</FormLabel>
                        <div className="space-y-2 max-h-56 overflow-auto border rounded p-2">
                          {availableSubjects
                            .filter((s) => {
                              // exclude subjects already mapped to another semester/year pair (unless it's the same mapping being edited)
                              const alreadyMappedElsewhere = mappings.some((m) => {
                                if (editingMapping && editingMapping.type === "group" && m.id === editingMapping.id) return false;
                                if (m.type === "individual") {
                                  return m.subjectId === s.id && (m.semester !== groupForm.watch("semester") || m.academicYear !== groupForm.watch("academicYear"));
                                } else {
                                  return m.subjects?.some((ss) => ss.id === s.id) && (m.semester !== groupForm.watch("semester") || m.academicYear !== groupForm.watch("academicYear"));
                                }
                              });
                              return !alreadyMappedElsewhere;
                            })
                            .map((s) => {
                              const checked = (field.value || []).includes(s.id);
                              return (
                                <div key={s.id} className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={() => {
                                        const curr = field.value || [];
                                        const next = curr.includes(s.id) ? curr.filter((id: string) => id !== s.id) : [...curr, s.id];
                                        field.onChange(next);
                                      }}
                                    />
                                    <div>
                                      <div className="text-sm font-medium">{s.code} — {s.name}</div>
                                      <div className="text-xs text-muted-foreground">T: {s.theoryHours ?? 0}h | P: {s.practicalHours ?? 0}h</div>
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground">{s.credits ?? "—"} cr</div>
                                </div>
                              );
                            })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={groupForm.control} name="semester" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select value={field.value.toString()} onValueChange={(v) => field.onChange(parseInt(v))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8].map((sem) => (
                                <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />

                      <FormField control={groupForm.control} name="academicYear" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <Input {...field} />
                        </FormItem>
                      )} />
                    </div>

                    <DialogFooter>
                      <Button type="submit">{editingMapping ? "Update Group" : "Create Group"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main content: Semester / List view */}
        {activeView === "semester" ? (
          // SemesterView should know how to render both individual mappings and groups
          <SemesterView mappings={mappings} academicYear="2024-25" />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Current Subject Mappings
                  </CardTitle>
                  <CardDescription>Subjects & elective groups mapped to AI & ML department semesters</CardDescription>
                </div>

                <div className="w-72">
                  <Input placeholder="Search mappings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {filteredMappings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No mappings found. Click "Map Subject" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMappings.map((mapping) => (
                    <Card key={mapping.id} className={`transition-all ${!mapping.isActive ? "opacity-60" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {mapping.type === "group" && <Badge variant="default">Elective Group</Badge>}
                              {mapping.type === "individual" && <Badge variant="outline">{mapping.subjectCode}</Badge>}
                              <Badge variant="secondary">Semester {mapping.semester}</Badge>
                              <Badge variant="outline">{mapping.academicYear}</Badge>
                              {mapping.isElective && <Badge variant="destructive">Elective</Badge>}
                              {!mapping.isActive && <Badge variant="secondary">Inactive</Badge>}
                            </div>

                            {mapping.type === "individual" ? (
                              <>
                                <h3 className="font-medium mb-1">{mapping.subjectName}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1"><Users className="h-4 w-4" /> Max Students: {mapping.maxStudents}</div>
                                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {mapping.academicYear}</div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium">{mapping.groupName}</h3>
                                  <Button variant="ghost" size="sm" onClick={() => toggleGroupExpansion(mapping.id)}>
                                    {expandedGroups.has(mapping.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </Button>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1"><Users className="h-4 w-4" /> Max Students: {mapping.maxStudents}</div>
                                  <div className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> Theory: {mapping.maxTheoryHours}h, Practical: {mapping.maxPracticalHours}h</div>
                                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {mapping.academicYear}</div>
                                </div>

                                <div className="mt-1 flex flex-wrap gap-2">
                                  {mapping.subjects?.slice(0, expandedGroups.has(mapping.id) ? undefined : 3).map((s) => (
                                    <Badge key={s.id} variant="outline" className="text-xs">{s.code}</Badge>
                                  ))}
                                  {!expandedGroups.has(mapping.id) && mapping.subjects && mapping.subjects.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">+{mapping.subjects.length - 3} more</Badge>
                                  )}
                                </div>

                                {expandedGroups.has(mapping.id) && (
                                  <div className="border-t pt-2 mt-2 space-y-2">
                                    {mapping.subjects?.map((s) => (
                                      <div key={s.id} className="flex items-center gap-2 text-sm">
                                        <Badge variant="outline">{s.code}</Badge>
                                        <div className="flex-1">
                                          <div>{s.name}</div>
                                          <div className="text-xs text-muted-foreground">T: {s.theoryHours ?? 0}h | P: {s.practicalHours ?? 0}h</div>
                                        </div>
                                        <Badge variant="secondary">{s.credits ?? "—"} cr</Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {/* checkbox for grouping mode: show for all individual mappings (so you can select any individual to group) */}
                            {electiveGroupMode && mapping.type === "individual" && (
                              <Checkbox
                                checked={selectedElectives.includes(mapping.subjectId || "")}
                                onCheckedChange={() => handleElectiveToggle(mapping.subjectId || "")}
                              />
                            )}

                            <Switch checked={mapping.isActive} onCheckedChange={() => toggleMappingStatus(mapping.id)} />

                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(mapping)}><Edit className="h-4 w-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDelete(mapping.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
