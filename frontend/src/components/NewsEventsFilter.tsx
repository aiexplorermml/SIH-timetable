import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

interface NewsEventsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  onClearFilters: () => void;
}

export function NewsEventsFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  onClearFilters,
}: NewsEventsFilterProps) {
  const hasActiveFilters = 
    statusFilter !== "all" || 
    typeFilter !== "all" || 
    categoryFilter !== "all" ||
    searchTerm.length > 0;

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search news & events by title, description..."
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
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
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