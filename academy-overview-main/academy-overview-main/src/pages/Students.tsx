import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { StudentsTable } from "@/components/StudentsTable";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download, Upload } from "lucide-react";
import { Student } from "@/types/student";

// Sample student data
const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    rollNo: "CS21001",
    regNo: "21CSE001",
    department: "Computer Science",
    section: "A",
    year: 3,
    contact: "+91-9876543210",
    email: "aarav.sharma@college.edu",
    status: "Current",
    activities: ["technical", "sports"]
  },
  {
    id: "2", 
    name: "Priya Patel",
    rollNo: "ME21045",
    regNo: "21ME045",
    department: "Mechanical Engineering",
    section: "B",
    year: 3,
    contact: "+91-9876543211",
    email: "priya.patel@college.edu", 
    status: "Current",
    activities: ["cultural"]
  },
  {
    id: "3",
    name: "Rahul Kumar",
    rollNo: "EE20032",
    regNo: "20EE032",
    department: "Electrical Engineering",
    section: "A",
    year: 4,
    contact: "+91-9876543212",
    email: "rahul.kumar@college.edu",
    status: "Current",
    activities: ["technical"]
  },
  {
    id: "4",
    name: "Sneha Reddy",
    rollNo: "CE19087",
    regNo: "19CE087", 
    department: "Civil Engineering",
    section: "C",
    year: 4,
    contact: "+91-9876543213",
    status: "Alumni",
    activities: ["sports", "cultural"]
  },
  {
    id: "5",
    name: "Arjun Singh",
    rollNo: "EC22156",
    regNo: "22EC156",
    department: "Electronics & Communication",
    section: "A",
    year: 2,
    contact: "+91-9876543214",
    email: "arjun.singh@college.edu",
    status: "Current",
    activities: ["technical"]
  },
  {
    id: "6",
    name: "Kavya Nair",
    rollNo: "CS20078",
    regNo: "20CS078",
    department: "Computer Science",
    section: "B",
    year: 4,
    contact: "+91-9876543215",
    email: "kavya.nair@college.edu",
    status: "Current",
    activities: ["cultural", "technical"]
  },
  {
    id: "7",
    name: "Vikram Joshi",
    rollNo: "ME18203",
    regNo: "18ME203",
    department: "Mechanical Engineering", 
    section: "A",
    year: 4,
    contact: "+91-9876543216",
    status: "Alumni",
    activities: ["sports"]
  },
  {
    id: "8",
    name: "Anita Gupta",
    rollNo: "EE21094",
    regNo: "21EE094",
    department: "Electrical Engineering",
    section: "B",
    year: 3,
    contact: "+91-9876543217",
    email: "anita.gupta@college.edu",
    status: "Current",
    activities: []
  },
  {
    id: "9",
    name: "Rohan Mehta",
    rollNo: "CS22134",
    regNo: "22CS134",
    department: "Computer Science",
    section: "C",
    year: 2,
    contact: "+91-9876543218",
    email: "rohan.mehta@college.edu",
    status: "Current",
    activities: ["technical"]
  },
  {
    id: "10",
    name: "Divya Iyer",
    rollNo: "CE21076",
    regNo: "21CE076",
    department: "Civil Engineering",
    section: "A",
    year: 3,
    contact: "+91-9876543219",
    email: "divya.iyer@college.edu",
    status: "Current",
    activities: ["cultural"]
  }
];

export default function Students() {
  const { toast } = useToast();
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and search logic
  const filteredStudents = useMemo(() => {
    return sampleStudents.filter((student) => {
      // Search filter
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.regNo.toLowerCase().includes(searchTerm.toLowerCase());

      // Department filter
      const matchesDepartment = 
        departmentFilter === "all" || 
        student.department.toLowerCase().replace(/\s+/g, "-") === departmentFilter;

      // Year filter
      const matchesYear = 
        yearFilter === "all" || 
        student.year.toString() === yearFilter;

      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        student.status.toLowerCase() === statusFilter;

      // Activity filter
      const matchesActivity = 
        activityFilter === "all" || 
        (activityFilter === "none" && student.activities.length === 0) ||
        student.activities.includes(activityFilter);

      return matchesSearch && matchesDepartment && matchesYear && matchesStatus && matchesActivity;
    });
  }, [searchTerm, departmentFilter, yearFilter, statusFilter, activityFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
    setYearFilter("all");
    setStatusFilter("all");
    setActivityFilter("all");
    setCurrentPage(1);
  };

  // Action handlers
  const handleViewDetails = (student: Student) => {
    toast({
      title: "View Student Details",
      description: `Opening details for ${student.name} (${student.rollNo})`,
    });
  };

  const handleEdit = (student: Student) => {
    toast({
      title: "Edit Student",
      description: `Opening edit form for ${student.name} (${student.rollNo})`,
    });
  };

  const handleDelete = (student: Student) => {
    toast({
      title: "Delete Student",
      description: `This would delete ${student.name} (${student.rollNo})`,
      variant: "destructive",
    });
  };

  const handleAddStudent = () => {
    toast({
      title: "Add New Student",
      description: "Opening student registration form",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Students Management</h2>
            <p className="text-muted-foreground">
              Manage student information, enrollment, and academic records.
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
            <Button onClick={handleAddStudent} className="gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          departmentFilter={departmentFilter}
          setDepartmentFilter={(value) => {
            setDepartmentFilter(value);
            handleFiltersChange();
          }}
          yearFilter={yearFilter}
          setYearFilter={(value) => {
            setYearFilter(value);
            handleFiltersChange();
          }}
          statusFilter={statusFilter}
          setStatusFilter={(value) => {
            setStatusFilter(value);
            handleFiltersChange();
          }}
          activityFilter={activityFilter}
          setActivityFilter={(value) => {
            setActivityFilter(value);
            handleFiltersChange();
          }}
          onClearFilters={clearFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {sampleStudents.length} students
          </p>
        </div>

        {/* Students Table */}
        <StudentsTable
          students={paginatedStudents}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}