import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  Clock, 
  Download,
  FileSpreadsheet,
  BookOpen
} from "lucide-react";
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { TimetableFilters } from "@/components/TimetableFilters";
import { TimetableGrid } from "@/components/TimetableGrid";

// Import mock data
import sampleTimetableData from "../../data/sample-section-timetable.json";
import { facultyViewData } from "../../data/facultyViewData.js";
import { classrooms } from "../../data/classrooms.js";

interface TimetableEntry {
  date: string;
  day_index: number;
  period: number;
  subject: string;
  faculty: string;
  room: string;
  is_lab: boolean;
  free: boolean;
}

interface SectionData {
  id: string;
  name: string;
  year: number;
  section: string;
}

// Mock subjects data
const mockSubjects = [
  { id: "SUBJ001", name: "Communicative English", code: "SUBJ001" },
  { id: "SUBJ002", name: "Mathematics", code: "SUBJ002" },
  { id: "SUBJ003", name: "Physics", code: "SUBJ003" },
  { id: "SUBJ004", name: "Chemistry", code: "SUBJ004" },
  { id: "SUBJ005", name: "Computer Programming", code: "SUBJ005" },
  { id: "SUBJ006", name: "Machine Learning", code: "SUBJ006" },
  { id: "SUBJ007", name: "Data Structures", code: "SUBJ007" },
  { id: "SUBJ008", name: "Statistics", code: "SUBJ008" },
  { id: "SUBJ009", name: "Digital Logic", code: "SUBJ009" },
  { id: "SUBJ010", name: "Python Programming", code: "SUBJ010" },
];

// Mock sections data from DepartmentClasses
const mockSections: SectionData[] = [
  { id: "aiml-1a", name: "AI&ML 1A", year: 1, section: "A" },
  { id: "aiml-1b", name: "AI&ML 1B", year: 1, section: "B" },
  { id: "aiml-2a", name: "AI&ML 2A", year: 2, section: "A" },
  { id: "aiml-2b", name: "AI&ML 2B", year: 2, section: "B" },
  { id: "aiml-3a", name: "AI&ML 3A", year: 3, section: "A" },
  { id: "aiml-3b", name: "AI&ML 3B", year: 3, section: "B" },
  { id: "aiml-4a", name: "AI&ML 4A", year: 4, section: "A" },
  { id: "aiml-4b", name: "AI&ML 4B", year: 4, section: "B" },
];

export default function DepartmentTimetable() {
  const [rawTimetableData, setRawTimetableData] = useState<Record<string, TimetableEntry[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [academicYear, setAcademicYear] = useState<string>("2025");
  const [semester, setSemester] = useState<string>("1");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<string>("section");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole] = useState<string>("admin"); // Mock user role

  // Load sample data on component mount
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRawTimetableData(sampleTimetableData as Record<string, TimetableEntry[]>);
      setIsLoading(false);
    }, 500);
  }, []);

  // Convert raw data to flat array for processing
  const allTimetableEntries = useMemo(() => {
    const entries: TimetableEntry[] = [];
    Object.entries(rawTimetableData).forEach(([sectionId, sectionEntries]) => {
      entries.push(...sectionEntries);
    });
    return entries;
  }, [rawTimetableData]);

  // Get unique academic years from data
  const academicYears = useMemo(() => {
    const years = new Set(
      allTimetableEntries.map(entry => new Date(entry.date).getFullYear().toString())
    );
    return Array.from(years).sort();
  }, [allTimetableEntries]);

  // Process faculty data for filters
  const facultyData = useMemo(() => {
    return facultyViewData.map(f => ({ id: f.id, name: f.name }));
  }, []);

  // Process rooms data for filters
  const roomsData = useMemo(() => {
    return classrooms.map(r => ({ id: r.id, name: r.name, number: r.number }));
  }, []);

  // Get filtered timetable data for selected date
  const dayTimetableData = useMemo(() => {
    const dateString = format(selectedDate, "yyyy-MM-dd");
    const filteredEntries = allTimetableEntries.filter(entry => {
      const matchesDate = entry.date === dateString;
      const matchesYear = new Date(entry.date).getFullYear().toString() === academicYear;
      return matchesDate && matchesYear;
    });

    // Apply section filter
    const sectionFiltered = selectedSections.length > 0 
      ? filteredEntries.filter(entry => {
          const sectionKey = Object.keys(rawTimetableData).find(key => 
            rawTimetableData[key].some(e => e === entry)
          );
          return selectedSections.includes(sectionKey || '');
        })
      : filteredEntries;

    // Apply faculty filter
    const facultyFiltered = selectedFaculty.length > 0
      ? sectionFiltered.filter(entry => selectedFaculty.includes(entry.faculty))
      : sectionFiltered;

    // Apply room filter
    const roomFiltered = selectedRooms.length > 0
      ? facultyFiltered.filter(entry => selectedRooms.includes(entry.room))
      : facultyFiltered;

    return roomFiltered;
  }, [allTimetableEntries, selectedDate, academicYear, selectedSections, selectedFaculty, selectedRooms, rawTimetableData]);

  // Get dates with classes for calendar highlighting
  const datesWithClasses = useMemo(() => {
    const dates = new Set(
      allTimetableEntries
        .filter(entry => new Date(entry.date).getFullYear().toString() === academicYear)
        .map(entry => entry.date)
    );
    return Array.from(dates).map(date => new Date(date));
  }, [allTimetableEntries, academicYear]);

  // Organize timetable by view mode
  const organizedTimetable = useMemo(() => {
    const result: Record<string, Record<number, TimetableEntry>> = {};
    
    dayTimetableData.forEach(entry => {
      let groupKey = '';
      
      switch (viewMode) {
        case 'faculty':
          groupKey = entry.faculty;
          break;
        case 'room':
          groupKey = entry.room;
          break;
        default: // section view
          groupKey = Object.keys(rawTimetableData).find(key => 
            rawTimetableData[key].some(e => e === entry)
          ) || 'unknown';
      }
      
      if (!result[groupKey]) {
        result[groupKey] = {};
      }
      result[groupKey][entry.period] = entry;
    });

    return result;
  }, [dayTimetableData, viewMode, rawTimetableData]);

  const handleExportPDF = () => {
    console.log("Exporting timetable as PDF for", format(selectedDate, "PPP"));
    // Implementation for PDF export
  };

  const handleExportExcel = () => {
    console.log("Exporting timetable as Excel for", format(selectedDate, "PPP"));
    // Implementation for Excel export
  };

  const handleCellEdit = (entry: TimetableEntry) => {
    console.log("Editing entry:", entry);
    // Implementation for cell editing
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Timetable</h1>
            <p className="text-muted-foreground">Interactive timetable management for AI&ML department</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <TimetableFilters
          academicYear={academicYear}
          semester={semester}
          selectedSections={selectedSections}
          selectedFaculty={selectedFaculty}
          selectedRooms={selectedRooms}
          viewMode={viewMode}
          academicYears={academicYears}
          sections={mockSections}
          faculty={facultyData}
          rooms={roomsData}
          onAcademicYearChange={setAcademicYear}
          onSemesterChange={setSemester}
          onSectionsChange={setSelectedSections}
          onFacultyChange={setSelectedFaculty}
          onRoomsChange={setSelectedRooms}
          onViewModeChange={setViewMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  hasClasses: datesWithClasses,
                  today: [new Date()]
                }}
                modifiersStyles={{
                  hasClasses: { 
                    backgroundColor: 'hsl(var(--primary))', 
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: 'bold'
                  },
                  today: { 
                    backgroundColor: 'hsl(var(--secondary))',
                    color: 'hsl(var(--secondary-foreground))',
                    fontWeight: 'bold'
                  }
                }}
              />
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>Has Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-secondary"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timetable */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timetable for {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  {isToday(selectedDate) && (
                    <Badge variant="secondary" className="ml-2">Today</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Role: {userRole.toUpperCase()}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-64"
                  >
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading timetable...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="timetable"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TimetableGrid
                      timetableData={organizedTimetable}
                      viewMode={viewMode}
                      userRole={userRole}
                      subjects={mockSubjects}
                      faculty={facultyData}
                      rooms={roomsData}
                      onCellEdit={handleCellEdit}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}