import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { departments } from "../../data/departments";

interface FacultySearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  qualificationFilter: string;
  setQualificationFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onClearFilters: () => void;
}

export function FacultySearchAndFilters({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  qualificationFilter,
  setQualificationFilter,
  statusFilter,
  setStatusFilter,
  onClearFilters,
}: FacultySearchAndFiltersProps) {
  const hasActiveFilters = 
    departmentFilter !== "all" || 
    qualificationFilter !== "all" || 
    statusFilter !== "all" ||
    searchTerm.length > 0;

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search faculty by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filters:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              {/* Department Filter */}
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Qualification Filter */}
              <Select value={qualificationFilter} onValueChange={setQualificationFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Qualification" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Qualifications</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                  <SelectItem value="me">M.E.</SelectItem>
                  <SelectItem value="msc">M.Sc</SelectItem>
                  <SelectItem value="btech">B.Tech</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="gap-2 whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}