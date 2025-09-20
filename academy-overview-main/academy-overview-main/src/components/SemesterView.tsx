import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subjects } from "../../data/subjects";
import { BookOpen, Clock, Users, GraduationCap } from "lucide-react";

interface SemesterViewProps {
  mappings: any[];
  academicYear: string;
}

export function SemesterView({ mappings, academicYear }: SemesterViewProps) {
  // Filter mappings by academic year and active status
  const activeMappings = mappings.filter(
    mapping => mapping.academicYear === academicYear && mapping.isActive
  );

  // Group mappings by semester
  const semesterGroups = activeMappings.reduce((acc, mapping) => {
    const semester = mapping.semester;
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(mapping);
    return acc;
  }, {} as Record<number, any[]>);

  // Sort semesters
  const sortedSemesters = Object.keys(semesterGroups)
    .map(Number)
    .sort((a, b) => a - b);

  const getSubjectDetails = (subjectId: string) => {
    return subjects.find(subject => subject.id === subjectId || subject.code === subjectId);
  };

  const getSemesterStats = (semesterMappings: any[]) => {
    const coreCount = semesterMappings.filter(m => !m.isElective).length;
    const electiveCount = semesterMappings.filter(m => m.isElective).length;
    const totalCapacity = semesterMappings.reduce((sum, m) => sum + (m.maxStudents || 0), 0);
    const totalHours = semesterMappings.reduce((sum, mapping) => {
      const subject = getSubjectDetails(mapping.subjectId);
      return sum + (subject?.totalHours || 0);
    }, 0);
    
    return { coreCount, electiveCount, totalCapacity, totalHours };
  };

  if (sortedSemesters.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>No active subject mappings found for {academicYear}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Academic Year {academicYear}</h2>
        <p className="text-muted-foreground">Semester-wise Subject Distribution</p>
      </div>

      {sortedSemesters.map((semester) => {
        const semesterMappings = semesterGroups[semester].sort((a, b) => 
          a.subjectCode.localeCompare(b.subjectCode)
        );
        const stats = getSemesterStats(semesterMappings);

        return (
          <Card key={semester} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <GraduationCap className="h-5 w-5" />
                    Semester {semester}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {stats.coreCount} Core • {stats.electiveCount} Electives • {stats.totalHours} Total Hours • {stats.totalCapacity} Max Capacity
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {semesterMappings.length} Subjects
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {stats.totalHours}h
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Subject Code</th>
                      <th className="text-left p-4 font-medium">Subject Name</th>
                      <th className="text-center p-4 font-medium">Type</th>
                      <th className="text-center p-4 font-medium">Total Hours</th>
                      <th className="text-center p-4 font-medium">Theory Hours</th>
                      <th className="text-center p-4 font-medium">Practical Hours</th>
                      <th className="text-center p-4 font-medium">Credits</th>
                      <th className="text-center p-4 font-medium">Max Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterMappings.map((mapping, index) => {
                      const subject = getSubjectDetails(mapping.subjectId);
                      return (
                        <tr 
                          key={mapping.id} 
                          className={`border-b transition-colors hover:bg-muted/30 ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                          }`}
                        >
                          <td className="p-4">
                            <Badge variant="outline" className="font-mono">
                              {mapping.subjectCode}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{mapping.subjectName}</div>
                            {subject?.description && (
                              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {subject.description}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <Badge 
                              variant={mapping.isElective ? "destructive" : "secondary"}
                              className="gap-1"
                            >
                              {mapping.isElective ? "Elective" : "Core"}
                            </Badge>
                          </td>
                          <td className="p-4 text-center font-medium">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {subject?.totalHours || 0}h
                            </div>
                          </td>
                          <td className="p-4 text-center text-muted-foreground">
                            {subject?.theoryHours || 0}h
                          </td>
                          <td className="p-4 text-center text-muted-foreground">
                            {subject?.practicalHours || 0}h
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline">
                              {subject?.credits || 0}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              {mapping.maxStudents}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Semester Summary */}
              <div className="bg-muted/30 p-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">Core:</span>
                    <span>{stats.coreCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Electives:</span>
                    <span>{stats.electiveCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Total Hours:</span>
                    <span>{stats.totalHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Total Capacity:</span>
                    <span>{stats.totalCapacity}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}