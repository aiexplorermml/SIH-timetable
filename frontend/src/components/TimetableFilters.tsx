import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface TimetableFiltersProps {
  academicYear: string;
  semester: string;
  selectedSections: string[];
  selectedFaculty: string[];
  selectedRooms: string[];
  viewMode: string;
  academicYears: string[];
  sections: Array<{ id: string; name: string; year: number }>;
  faculty: Array<{ id: string; name: string }>;
  rooms: Array<{ id: string; name: string; number: string }>;
  onAcademicYearChange: (year: string) => void;
  onSemesterChange: (semester: string) => void;
  onSectionsChange: (sections: string[]) => void;
  onFacultyChange: (faculty: string[]) => void;
  onRoomsChange: (rooms: string[]) => void;
  onViewModeChange: (mode: string) => void;
}

export function TimetableFilters({
  academicYear,
  semester,
  selectedSections,
  selectedFaculty,
  selectedRooms,
  viewMode,
  academicYears,
  sections,
  faculty,
  rooms,
  onAcademicYearChange,
  onSemesterChange,
  onSectionsChange,
  onFacultyChange,
  onRoomsChange,
  onViewModeChange,
}: TimetableFiltersProps) {
  const sectionOptions = sections.map(section => ({
    label: section.name.toUpperCase(),
    value: section.id,
  }));

  const facultyOptions = faculty.map(f => ({
    label: f.name,
    value: f.id,
  }));

  const roomOptions = rooms.map(room => ({
    label: `${room.name} (${room.number})`,
    value: room.id,
  }));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Academic Year */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Academic Year</label>
            <Select value={academicYear} onValueChange={onAcademicYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}-{parseInt(year) + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Semester</label>
            <Select value={semester} onValueChange={onSemesterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sections */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sections</label>
            <MultiSelect
              options={sectionOptions}
              value={selectedSections}
              onChange={onSectionsChange}
              placeholder="Select sections"
              className="w-full"
            />
          </div>

          {/* Faculty */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Faculty</label>
            <MultiSelect
              options={facultyOptions}
              value={selectedFaculty}
              onChange={onFacultyChange}
              placeholder="Select faculty"
              className="w-full"
            />
          </div>

          {/* Rooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rooms</label>
            <MultiSelect
              options={roomOptions}
              value={selectedRooms}
              onChange={onRoomsChange}
              placeholder="Select rooms"
              className="w-full"
            />
          </div>

          {/* View Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium">View Mode</label>
            <Select value={viewMode} onValueChange={onViewModeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="section">Section View</SelectItem>
                <SelectItem value="faculty">Faculty View</SelectItem>
                <SelectItem value="room">Room View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedSections.length > 0 || selectedFaculty.length > 0 || selectedRooms.length > 0) && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSections.map(sectionId => {
                const section = sections.find(s => s.id === sectionId);
                return section ? (
                  <Badge key={sectionId} variant="secondary" className="text-xs">
                    {section.name.toUpperCase()}
                  </Badge>
                ) : null;
              })}
              {selectedFaculty.map(facultyId => {
                const facultyMember = faculty.find(f => f.id === facultyId);
                return facultyMember ? (
                  <Badge key={facultyId} variant="secondary" className="text-xs">
                    {facultyMember.name.split(' ').slice(-1)[0]}
                  </Badge>
                ) : null;
              })}
              {selectedRooms.map(roomId => {
                const room = rooms.find(r => r.id === roomId);
                return room ? (
                  <Badge key={roomId} variant="secondary" className="text-xs">
                    {room.number}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}