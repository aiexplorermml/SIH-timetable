import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FacultySearchAndFilters } from "@/components/FacultySearchAndFilters";
import { FacultyTable } from "@/components/FacultyTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download, Upload } from "lucide-react";
import type { Faculty } from "@/types/faculty";
import { getAllFaculty } from "@/data/facultyData";

// Use centralized faculty data
const sampleFaculty: Faculty[] = getAllFaculty();

export default function Faculty() {
  const { toast } = useToast();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and search logic
  const filteredFaculty = useMemo(() => {
    return sampleFaculty.filter((faculty) => {
      // Search filter
      const matchesSearch = 
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.facultyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchTerm.toLowerCase());

      // Department filter
      const matchesDepartment = 
        departmentFilter === "all" || 
        faculty.department.toLowerCase().replace(/\s+/g, "-") === departmentFilter;

      // Qualification filter
      const matchesQualification = 
        qualificationFilter === "all" || 
        faculty.qualification.toLowerCase().replace(/\./g, "").replace(/\s+/g, "") === qualificationFilter.replace(/\./g, "").replace(/\s+/g, "");

      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        faculty.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesDepartment && matchesQualification && matchesStatus;
    });
  }, [searchTerm, departmentFilter, qualificationFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFaculty = filteredFaculty.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setQualificationFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Action handlers
  const handleViewDetails = (faculty: Faculty) => {
    toast({
      title: "View Faculty Details",
      description: `Opening details for ${faculty.name} (${faculty.facultyId})`,
    });
  };

  const handleEdit = (faculty: Faculty) => {
    toast({
      title: "Edit Faculty",
      description: `Opening edit form for ${faculty.name} (${faculty.facultyId})`,
    });
  };

  const handleDelete = (faculty: Faculty) => {
    toast({
      title: "Delete Faculty",
      description: `This would delete ${faculty.name} (${faculty.facultyId})`,
      variant: "destructive",
    });
  };

  const handleAddFaculty = () => {
    toast({
      title: "Add New Faculty",
      description: "Opening faculty registration form",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Faculty Management</h2>
            <p className="text-muted-foreground">
              Manage faculty information, qualifications, and department assignments.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button onClick={handleAddFaculty} className="gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Add Faculty
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <FacultySearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          departmentFilter={departmentFilter}
          setDepartmentFilter={(value) => {
            setDepartmentFilter(value);
            handleFiltersChange();
          }}
          qualificationFilter={qualificationFilter}
          setQualificationFilter={(value) => {
            setQualificationFilter(value);
            handleFiltersChange();
          }}
          statusFilter={statusFilter}
          setStatusFilter={(value) => {
            setStatusFilter(value);
            handleFiltersChange();
          }}
          onClearFilters={clearFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredFaculty.length} of {sampleFaculty.length} faculty members
          </p>
        </div>

        {/* Faculty Table */}
        <FacultyTable
          faculty={paginatedFaculty}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {filteredFaculty.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredFaculty.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}