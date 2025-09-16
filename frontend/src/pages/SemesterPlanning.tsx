import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format, addYears, eachDayOfInterval, isWeekend } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SemesterData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  theoryHours: number;
  practicalHours: number;
}

interface Holiday {
  id: string;
  date: Date;
  description: string;
}

interface ExamSchedule {
  id: string;
  semesterId: string;
  startDate: Date;
  endDate: Date;
}

const academicYears = [
  "2024-25",
  "2023-24", 
  "2022-23",
  "2021-22"
];

const defaultSemesters: SemesterData[] = [
  { id: "1-1", name: "Semester 1-1", startDate: new Date("2025-06-30"), endDate: new Date("2025-11-29"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
  { id: "1-2", name: "Semester 1-2", startDate: new Date("2025-12-01"), endDate: new Date("2026-06-08"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
  { id: "2-1", name: "Semester 2-1", startDate: new Date("2025-06-30"), endDate: new Date("2025-11-29"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
  { id: "2-2", name: "Semester 2-2", startDate: new Date("2025-12-01"), endDate: new Date("2026-06-08"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
  { id: "3-1", name: "Semester 3-1", startDate: new Date("2025-06-30"), endDate: new Date("2025-11-29"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
  { id: "3-2", name: "Semester 3-2", startDate: new Date("2025-12-01"), endDate: new Date("2026-06-08"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
  { id: "4-1", name: "Semester 4-1", startDate: new Date("2025-06-30"), endDate: new Date("2025-11-29"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
  { id: "4-2", name: "Semester 4-2", startDate: new Date("2025-12-01"), endDate: new Date("2026-06-08"), totalHours: 0, theoryHours: 0, practicalHours: 0 },
];

const defaultExamSchedules: ExamSchedule[] = [
  { id: "1-1", semesterId: "1-1", startDate: new Date("2025-11-15"), endDate: new Date("2025-11-25") },
  { id: "1-2", semesterId: "1-2", startDate: new Date("2026-05-20"), endDate: new Date("2026-05-30") },
  { id: "2-1", semesterId: "2-1", startDate: new Date("2025-11-15"), endDate: new Date("2025-11-25") },
  { id: "2-2", semesterId: "2-2", startDate: new Date("2026-05-20"), endDate: new Date("2026-05-30") },
  { id: "3-1", semesterId: "3-1", startDate: new Date("2025-11-15"), endDate: new Date("2025-11-25") },
  { id: "3-2", semesterId: "3-2", startDate: new Date("2026-05-20"), endDate: new Date("2026-05-30") },
  { id: "4-1", semesterId: "4-1", startDate: new Date("2025-11-15"), endDate: new Date("2025-11-25") },
  { id: "4-2", semesterId: "4-2", startDate: new Date("2026-05-20"), endDate: new Date("2026-05-30") },
];

const getDefaultHolidays = (): Holiday[] => {
  const holidays: Holiday[] = [];
  
  // Add specific Indian holidays
  const specificHolidays = [
    { date: new Date("2025-08-15"), description: "Independence Day" },
    { date: new Date("2025-08-28"), description: "Ganesh Chaturthi" },
    { date: new Date("2025-10-02"), description: "Gandhi Jayanti" },
    { date: new Date("2025-10-21"), description: "Diwali (Deepavali)" },
    { date: new Date("2025-12-25"), description: "Christmas" },
    { date: new Date("2026-01-01"), description: "New Year's Day" },
    { date: new Date("2026-01-26"), description: "Republic Day" },
    { date: new Date("2026-03-19"), description: "Ugadi / Gudi Padwa" },
    { date: new Date("2026-05-01"), description: "May Day (Labour Day)" },
  ];
  
  // Add specific holidays
  specificHolidays.forEach((holiday, index) => {
    holidays.push({
      id: `specific-${index}`,
      date: holiday.date,
      description: holiday.description
    });
  });
  
  // Add all Sundays from 2025 to 2029
  const startYear = 2025;
  const endYear = 2026;
  
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date.getDay() === 0) { // Sunday
          holidays.push({
            id: `sunday-${year}-${month}-${day}`,
            date: date,
            description: "Sunday"
          });
        }
      }
    }
  }
  
  return holidays;
};

const SemesterPlanning = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2024-25");
  const [semesters, setSemesters] = useState<SemesterData[]>(defaultSemesters);
  const [holidays, setHolidays] = useState<Holiday[]>(getDefaultHolidays());
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>(defaultExamSchedules);

  const handleSemesterDateChange = (semesterId: string, field: 'startDate' | 'endDate', date: Date) => {
    setSemesters(prev => {
      const updated = prev.map(sem => 
        sem.id === semesterId ? { ...sem, [field]: date } : sem
      );

      // Auto-generate dates for other semesters if editing 1-1 or 1-2
      if (semesterId === "1-1" || semesterId === "1-2") {
        return generateSemesterDates(updated);
      }
      
      return updated;
    });
  };

  const generateSemesterDates = (baseSemesters: SemesterData[]) => {
    const sem11 = baseSemesters.find(s => s.id === "1-1");
    const sem12 = baseSemesters.find(s => s.id === "1-2");
    
    if (!sem11 || !sem12) return baseSemesters;

    return baseSemesters.map(sem => {
      if (["1-1", "1-2"].includes(sem.id)) return sem;
      
      const yearOffset = parseInt(sem.id.split("-")[0]) - 1;
      const isFirstSem = sem.id.endsWith("-1");
      const baseSem = isFirstSem ? sem11 : sem12;
      
      return {
        ...sem,
        startDate: addYears(baseSem.startDate, yearOffset),
        endDate: addYears(baseSem.endDate, yearOffset)
      };
    });
  };

  const handleExamDateChange = (semesterId: string, field: 'startDate' | 'endDate', date: Date) => {
    setExamSchedules(prev => {
      const updated = prev.map(exam => 
        exam.semesterId === semesterId ? { ...exam, [field]: date } : exam
      );

      // Auto-generate dates for other exam schedules if editing 1-1 or 1-2
      if (semesterId === "1-1" || semesterId === "1-2") {
        return generateExamDates(updated);
      }
      
      return updated;
    });
  };

  const generateExamDates = (baseExams: ExamSchedule[]) => {
    const exam11 = baseExams.find(e => e.semesterId === "1-1");
    const exam12 = baseExams.find(e => e.semesterId === "1-2");
    
    if (!exam11 || !exam12) return baseExams;

    return baseExams.map(exam => {
      if (["1-1", "1-2"].includes(exam.semesterId)) return exam;
      
      const yearOffset = parseInt(exam.semesterId.split("-")[0]) - 1;
      const isFirstSem = exam.semesterId.endsWith("-1");
      const baseExam = isFirstSem ? exam11 : exam12;
      
      return {
        ...exam,
        startDate: addYears(baseExam.startDate, yearOffset),
        endDate: addYears(baseExam.endDate, yearOffset)
      };
    });
  };

  const addHoliday = () => {
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      date: new Date(),
      description: "New Holiday"
    };
    setHolidays(prev => [...prev, newHoliday]);
  };

  const updateHoliday = (id: string, field: 'date' | 'description', value: Date | string) => {
    setHolidays(prev => prev.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const calculateWorkingDays = (startDate: Date, endDate: Date) => {
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const holidayDates = holidays.map(h => h.date.toDateString());
    
    return allDays.filter(day => 
      !isWeekend(day) && !holidayDates.includes(day.toDateString())
    ).length;
  };

  const calculateSemesterStats = (semester: SemesterData) => {
    const workingDays = calculateWorkingDays(semester.startDate, semester.endDate);
    
    // Calculate holidays within semester period
    const semesterHolidays = holidays.filter(holiday => 
      holiday.date >= semester.startDate && holiday.date <= semester.endDate
    ).length;
    
    // Calculate exam days within semester period
    const semesterExam = examSchedules.find(exam => exam.semesterId === semester.id);
    const examDays = semesterExam ? 
      eachDayOfInterval({ start: semesterExam.startDate, end: semesterExam.endDate }).length : 0;
    
    // Net available days = working days - holidays - exam days
    const netAvailableDays = Math.max(0, workingDays - semesterHolidays - examDays);
    const netAvailableHours = netAvailableDays * 6;
    
    return { 
      workingDays, 
      holidays: semesterHolidays, 
      examDays, 
      netAvailableDays, 
      netAvailableHours 
    };
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: `Academic year planning for ${selectedYear} has been saved.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Academic Year Planning</h1>
        </div>

        {/* Academic Year Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Year Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-64">
              <Label htmlFor="academic-year">Select Academic Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="semester-dates" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="semester-dates">Semester Dates</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
            <TabsTrigger value="exam-schedule">Exam Schedule</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="semester-dates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Semester Dates Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set dates for Semester 1-1 and 1-2. Other semesters will be auto-generated but remain editable.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {semesters.map((semester) => (
                    <Card key={semester.id} className={cn(
                      "relative",
                      ["1-1", "1-2"].includes(semester.id) && "border-primary"
                    )}>
                      <CardHeader>
                        <CardTitle className="text-lg">{semester.name}</CardTitle>
                        {["1-1", "1-2"].includes(semester.id) && (
                          <p className="text-xs text-primary">Base semester</p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Start Date */}
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !semester.startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {semester.startDate ? (
                                  format(semester.startDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={semester.startDate}
                                onSelect={(date) => date && handleSemesterDateChange(semester.id, 'startDate', date)}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !semester.endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {semester.endDate ? (
                                  format(semester.endDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={semester.endDate}
                                onSelect={(date) => date && handleSemesterDateChange(semester.id, 'endDate', date)}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holidays" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Holiday Management</CardTitle>
                  <Button onClick={addHoliday} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Holiday
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holidays.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No holidays added yet. Click "Add Holiday" to get started.
                    </p>
                  ) : (
                    holidays.map((holiday) => (
                      <div key={holiday.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(holiday.date, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={holiday.date}
                                onSelect={(date) => date && updateHoliday(holiday.id, 'date', date)}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex-2">
                          <Label>Description</Label>
                          <Input
                            value={holiday.description}
                            onChange={(e) => updateHoliday(holiday.id, 'description', e.target.value)}
                            placeholder="Holiday description"
                          />
                        </div>
                        <Button
                          onClick={() => removeHoliday(holiday.id)}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam-schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tentative Exam Schedule</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set exam periods for each semester. Dates can be adjusted as needed.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {semesters.map((semester) => {
                    const examSchedule = examSchedules.find(e => e.semesterId === semester.id);
                    return (
                      <Card key={semester.id} className={cn(
                        "relative",
                        ["1-1", "1-2"].includes(semester.id) && "border-primary"
                      )}>
                        <CardHeader>
                          <CardTitle className="text-lg">{semester.name} Exams</CardTitle>
                          {["1-1", "1-2"].includes(semester.id) && (
                            <p className="text-xs text-primary">Base exam schedule</p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Exam Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !examSchedule?.startDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {examSchedule?.startDate ? (
                                    format(examSchedule.startDate, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={examSchedule?.startDate}
                                  onSelect={(date) => date && handleExamDateChange(semester.id, 'startDate', date)}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label>Exam End Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !examSchedule?.endDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {examSchedule?.endDate ? (
                                    format(examSchedule.endDate, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={examSchedule?.endDate}
                                  onSelect={(date) => date && handleExamDateChange(semester.id, 'endDate', date)}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Year Summary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Overview of working days and net available days for each semester after excluding holidays and exam days.
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semester</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Working Days</TableHead>
                      <TableHead>No of Holidays</TableHead>
                      <TableHead>Exam Days</TableHead>
                      <TableHead>Net Available Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semesters.map((semester) => {
                      const stats = calculateSemesterStats(semester);
                      return (
                        <TableRow key={semester.id}>
                          <TableCell className="font-medium">{semester.name}</TableCell>
                          <TableCell>
                            {semester.startDate ? format(semester.startDate, "PP") : "-"}
                          </TableCell>
                          <TableCell>
                            {semester.endDate ? format(semester.endDate, "PP") : "-"}
                          </TableCell>
                          <TableCell>{stats.workingDays}</TableCell>
                          <TableCell>{stats.holidays}</TableCell>
                          <TableCell>{stats.examDays}</TableCell>
                          <TableCell>{stats.netAvailableDays}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="border-t-2 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        {semesters.reduce((total, sem) => total + calculateSemesterStats(sem).workingDays, 0)}
                      </TableCell>
                      <TableCell>
                        {semesters.reduce((total, sem) => total + calculateSemesterStats(sem).holidays, 0)}
                      </TableCell>
                      <TableCell>
                        {semesters.reduce((total, sem) => total + calculateSemesterStats(sem).examDays, 0)}
                      </TableCell>
                      <TableCell>
                        {semesters.reduce((total, sem) => total + calculateSemesterStats(sem).netAvailableDays, 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Academic Year Planning
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SemesterPlanning;