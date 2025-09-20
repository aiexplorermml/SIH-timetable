import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, BookOpen, Clock, TrendingUp } from "lucide-react";
import { useDepartment } from "@/hooks/useDepartment";
import { subjectMapping } from "../../data/subjectMapping.js";
import { deptSections } from "../../data/departmentSections.js";

// Mock data for sections
const mockSections = deptSections;

export default function DepartmentSections() {
  const { currentDepartment, departmentId } = useDepartment();
  const [selectedClass, setSelectedClass] = useState(mockSections[0]);
  const [searchTerm, setSearchTerm] = useState("");

  if (!currentDepartment) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Department not found
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {currentDepartment.fullName} - Sections
          </h1>
          <p className="text-muted-foreground">
            Manage sections, students, and subject progress
          </p>
        </div>

        {/* Class Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockSections.map((classItem) => (
            <Card
              key={classItem.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedClass.id === classItem.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedClass(classItem)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{classItem.name}</h3>
                  <Badge variant="secondary">
                    {classItem.totalStudents} students
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Class Teacher: {classItem.classTeacher}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
