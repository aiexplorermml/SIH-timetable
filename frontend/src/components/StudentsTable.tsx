import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Student } from "@/types/student";
import { useNavigate } from "react-router-dom";

interface StudentsTableProps {
  students: Student[];
  onViewDetails: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentsTable({ students, onViewDetails, onEdit, onDelete }: StudentsTableProps) {
  const navigate = useNavigate();
  const getStatusBadge = (status: string) => {
    return status === "Current" ? "default" : "secondary";
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      "Computer Science": "bg-primary/10 text-primary",
      "Mechanical Engineering": "bg-secondary/10 text-secondary",
      "Electrical Engineering": "bg-tertiary/10 text-tertiary",
      "Civil Engineering": "bg-warning/10 text-warning",
      "Electronics & Communication": "bg-destructive/10 text-destructive"
    };
    return colors[department] || "bg-muted text-muted-foreground";
  };

  if (students.length === 0) {
    return (
      <div className="bg-gradient-card rounded-lg border-0 shadow-soft-lg p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">No students found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or clear the filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card rounded-lg border-0 shadow-soft-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/40 border-border">
            <TableHead className="font-semibold text-foreground">Name</TableHead>
            <TableHead className="font-semibold text-foreground">Roll No</TableHead>
            <TableHead className="font-semibold text-foreground">Reg No</TableHead>
            <TableHead className="font-semibold text-foreground">Department</TableHead>
            <TableHead className="font-semibold text-foreground">Section</TableHead>
            <TableHead className="font-semibold text-foreground">Year</TableHead>
            <TableHead className="font-semibold text-foreground">Contact</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow 
              key={student.id}
              className={`border-border hover:bg-muted/20 transition-colors ${
                index % 2 === 0 ? "bg-background/50" : "bg-background/30"
              }`}
            >
              <TableCell className="font-medium">
                <div className="space-y-1">
                  <div className="text-foreground">{student.name}</div>
                  {student.email && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {student.email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{student.rollNo}</TableCell>
              <TableCell className="font-mono text-sm">{student.regNo}</TableCell>
              <TableCell>
                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getDepartmentColor(student.department)}`}>
                  {student.department}
                </span>
              </TableCell>
              <TableCell className="text-center font-medium">{student.section}</TableCell>
              <TableCell className="text-center">{student.year}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {student.contact}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadge(student.status)} className="text-xs">
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(student)}
                    className="h-8 w-8 p-0 hover:bg-secondary/10 hover:text-secondary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(student)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}