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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Minus,
  Plus,
} from "lucide-react";
import { format, isToday, addDays, addWeeks } from "date-fns";
import { TimetableFilters } from "@/components/TimetableFilters";
import { TimetableGrid } from "@/components/TimetableGrid";

// Import mock data
import sampleTimetableData from "../../data/sample-section-timetable.json";
import { facultyViewData } from "../../data/facultyViewData.js";
import { classrooms } from "../../data/classrooms.js";
import { subjects } from "../../data/subjects.js";
import { deptSections } from "../../data/departmentsections.js";

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
const mockSubjects = subjects;

// Mock sections data
const mockSections = deptSections;

export default function DepartmentTimetable() {
  const [rawTimetableData, setRawTimetableData] = useState<
    Record<string, TimetableEntry[]>
  >({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [academicYear, setAcademicYear] = useState<string>("2025");
  const [semester, setSemester] = useState<string>("1");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<string>("section");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole] = useState<string>("admin"); // Mock user role
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);

  // Load sample data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRawTimetableData(
        sampleTimetableData as Record<string, TimetableEntry[]>
      );
      setIsLoading(false);
    }, 500);
  }, []);

  // Flatten entries
  const allTimetableEntries = useMemo(() => {
    const entries: TimetableEntry[] = [];
    Object.entries(rawTimetableData).forEach(([_, sectionEntries]) => {
      entries.push(...sectionEntries);
    });
    return entries;
  }, [rawTimetableData]);

  // Academic years
  const academicYears = useMemo(() => {
    const years = new Set(
      allTimetableEntries.map((entry) =>
        new Date(entry.date).getFullYear().toString()
      )
    );
    return Array.from(years).sort();
  }, [allTimetableEntries]);

  // Faculty & Rooms
  const facultyData = useMemo(
    () => facultyViewData.map((f) => ({ id: f.id, name: f.name })),
    []
  );
  const roomsData = useMemo(
    () => classrooms.map((r) => ({ id: r.id, name: r.name, number: r.number })),
    []
  );

  // Filter + group timetable
  const timetableData = useMemo(() => {
    let filteredEntries = allTimetableEntries;

    if (selectedSections.length > 0) {
      filteredEntries = filteredEntries.filter((entry) => {
        const sectionKey = Object.keys(rawTimetableData).find((key) =>
          rawTimetableData[key].some((e) => e === entry)
        );
        return selectedSections.includes(sectionKey || "");
      });
    }
    if (selectedFaculty.length > 0) {
      filteredEntries = filteredEntries.filter((entry) =>
        selectedFaculty.includes(entry.faculty)
      );
    }
    if (selectedRooms.length > 0) {
      filteredEntries = filteredEntries.filter((entry) =>
        selectedRooms.includes(entry.room)
      );
    }

    const grouped: Record<string, Record<number, TimetableEntry[]>> = {};
    filteredEntries.forEach((entry) => {
      const dayKey = entry.date;
      if (!grouped[dayKey]) grouped[dayKey] = {};
      if (!grouped[dayKey][entry.period]) grouped[dayKey][entry.period] = [];
      grouped[dayKey][entry.period].push(entry);
    });

    return grouped;
  }, [
    allTimetableEntries,
    selectedDate,
    academicYear,
    semester,
    selectedSections,
    selectedFaculty,
    selectedRooms,
    viewMode,
    rawTimetableData,
  ]);

  // Dates with classes
  const datesWithClasses = useMemo(() => {
    const dates = new Set(
      allTimetableEntries
        .filter(
          (entry) =>
            new Date(entry.date).getFullYear().toString() === academicYear
        )
        .map((entry) => entry.date)
    );
    return Array.from(dates).map((date) => new Date(date));
  }, [allTimetableEntries, academicYear]);

  // Organized timetable
  const organizedTimetable = useMemo(() => {
    const result: Record<string, Record<number, TimetableEntry[]>> = {};
    const dayKey = format(selectedDate, "yyyy-MM-dd");
    const dayData = timetableData[dayKey] || {};

    Object.values(dayData)
      .flat()
      .forEach((entry) => {
        let groupKey = "";

        switch (viewMode) {
          case "faculty":
            groupKey = entry.faculty;
            break;
          case "room":
            groupKey = entry.room;
            break;
          default:
            groupKey =
              Object.keys(rawTimetableData).find((key) =>
                rawTimetableData[key].some((e) => e === entry)
              ) || "unknown";
        }

        if (!result[groupKey]) result[groupKey] = {};
        if (!result[groupKey][entry.period])
          result[groupKey][entry.period] = [];
        result[groupKey][entry.period].push(entry);
      });

    return result;
  }, [timetableData, selectedDate, viewMode, rawTimetableData]);

  // Navigation
  const goToPrevDay = () => setSelectedDate((d) => addDays(d, -1));
  const goToNextDay = () => setSelectedDate((d) => addDays(d, 1));
  const goToPrevWeek = () => setSelectedDate((d) => addWeeks(d, -1));
  const goToNextWeek = () => setSelectedDate((d) => addWeeks(d, 1));

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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

        <div
          className={`grid gap-6 ${
            isCalendarVisible ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {/* Calendar */}
          {isCalendarVisible && (
            <Card className="lg:col-span-1 relative">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsCalendarVisible(false)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    hasClasses: datesWithClasses,
                    today: [new Date()],
                  }}
                  modifiersStyles={{
                    hasClasses: {
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                      fontWeight: "bold",
                    },
                    today: {
                      backgroundColor: "hsl(var(--secondary))",
                      color: "hsl(var(--secondary-foreground))",
                      fontWeight: "bold",
                    },
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Timetable */}
          <Card
            className={`${isCalendarVisible ? "lg:col-span-3" : "col-span-1"}`}
          >
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={goToPrevWeek}>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={goToPrevDay}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                  <Button size="sm" variant="ghost" onClick={goToNextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={goToNextWeek}>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                  {isToday(selectedDate) && (
                    <Badge variant="secondary" className="ml-2">
                      Today
                    </Badge>
                  )}
                </div>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Role: {userRole.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!isCalendarVisible && (
                <div className="flex justify-start mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCalendarVisible(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Show Calendar
                  </Button>
                </div>
              )}

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
                      <p className="mt-2 text-muted-foreground">
                        Loading timetable...
                      </p>
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
