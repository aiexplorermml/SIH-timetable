import { useState, useMemo } from "react";
import { Search, Eye, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepartment } from "@/hooks/useDepartment";
import { Faculty } from "@/types/faculty";
import { getFacultyByDepartment } from "@/data/facultyData";

export default function DepartmentFaculty() {
  const { currentDepartment, departmentId } = useDepartment();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log("DepartmentFaculty - departmentId:", departmentId);
  console.log("DepartmentFaculty - currentDepartment:", currentDepartment);

  const departmentFaculty = getFacultyByDepartment(departmentId || "");

  const filteredFaculty = useMemo(() => {
    return departmentFaculty.filter((faculty) => {
      const matchesSearch = 
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesQualification = 
        qualificationFilter === "all" || 
        faculty.qualification.toLowerCase().includes(qualificationFilter.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" || 
        faculty.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesQualification && matchesStatus;
    });
  }, [departmentFaculty, searchTerm, qualificationFilter, statusFilter]);

  const handleViewFaculty = (facultyId: string) => {
    navigate(`/department/${departmentId}/faculty/${facultyId}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setQualificationFilter("all");
    setStatusFilter("all");
  };

  if (!currentDepartment) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Department not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {currentDepartment.fullName} Faculty
            </h2>
            <p className="text-muted-foreground">
              View faculty members in the {currentDepartment.name} department
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search faculty by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <Select value={qualificationFilter} onValueChange={setQualificationFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Qualifications</SelectItem>
                      <SelectItem value="phd">Ph.D.</SelectItem>
                      <SelectItem value="mtech">M.Tech</SelectItem>
                      <SelectItem value="msc">M.Sc</SelectItem>
                      <SelectItem value="btech">B.Tech</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <Filter className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Faculty Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredFaculty.length} of {departmentFaculty.length} faculty members
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <Card key={faculty.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={faculty.profilePicture} />
                    <AvatarFallback>
                      {faculty.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{faculty.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">
                      {faculty.facultyId}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Qualification</p>
                    <p className="text-sm">{faculty.qualification}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Experience</p>
                    <p className="text-sm">{faculty.experience} years</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={faculty.status === "Active" ? "default" : "secondary"}>
                      {faculty.status}
                    </Badge>
                  </div>

                  {faculty.specialization && faculty.specialization.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Specialization</p>
                      <div className="flex flex-wrap gap-1">
                        {faculty.specialization.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {faculty.specialization.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{faculty.specialization.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewFaculty(faculty.id)}
                    className="gap-2 flex-1"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredFaculty.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                {departmentFaculty.length === 0 
                  ? `No faculty members found in ${currentDepartment.name} department.`
                  : "No faculty members match your search criteria."
                }
              </p>
              {departmentFaculty.length > 0 && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}