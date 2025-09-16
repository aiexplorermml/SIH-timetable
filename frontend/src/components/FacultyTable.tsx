import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Faculty } from "@/types/faculty";
import { useNavigate } from "react-router-dom";

interface FacultyTableProps {
  faculty: Faculty[];
  onViewDetails: (faculty: Faculty) => void;
  onEdit: (faculty: Faculty) => void;
  onDelete: (faculty: Faculty) => void;
}

export function FacultyTable({ faculty, onViewDetails, onEdit, onDelete }: FacultyTableProps) {
  const navigate = useNavigate();

  if (faculty.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No faculty members found</p>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your search criteria or filters
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-semibold text-foreground">Faculty ID</TableHead>
              <TableHead className="font-semibold text-foreground">Department</TableHead>
              <TableHead className="font-semibold text-foreground">Qualification</TableHead>
              <TableHead className="font-semibold text-foreground">Contact</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map((member, index) => (
              <TableRow
                key={member.id}
                className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      {member.email && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm bg-secondary/50 px-2 py-1 rounded">
                    {member.facultyId}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-background">
                    {member.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-primary">{member.qualification}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {member.contact}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={member.status === "Active" ? "default" : "secondary"}
                    className={member.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {member.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/faculty/${member.id}`)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(member)}
                      className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(member)}
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
      </CardContent>
    </Card>
  );
}