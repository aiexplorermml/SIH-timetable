import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { departments } from "../../data/departments";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  activityFilter: string;
  setActivityFilter: (value: string) => void;
  onClearFilters: () => void;
}

export function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  yearFilter,
  setYearFilter,
  statusFilter,
  setStatusFilter,
  activityFilter,
  setActivityFilter,
  onClearFilters
}: SearchAndFiltersProps) {
  const hasActiveFilters = departmentFilter || yearFilter || statusFilter || activityFilter;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name, roll number, or registration number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-background shadow-soft-sm border-border focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters:</span>
        </div>

        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-48 bg-background shadow-soft-sm">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-soft-lg z-50">
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-32 bg-background shadow-soft-sm">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-soft-lg z-50">
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="1">1st Year</SelectItem>
            <SelectItem value="2">2nd Year</SelectItem>
            <SelectItem value="3">3rd Year</SelectItem>
            <SelectItem value="4">4th Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-background shadow-soft-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-soft-lg z-50">
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activityFilter} onValueChange={setActivityFilter}>
          <SelectTrigger className="w-48 bg-background shadow-soft-sm">
            <SelectValue placeholder="Activity Involvement" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-soft-lg z-50">
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="none">No Activities</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}