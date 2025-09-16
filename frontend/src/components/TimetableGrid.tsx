import React from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, BookOpen, Edit, Send, Eye } from "lucide-react";

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

interface TimetableGridProps {
  timetableData: Record<string, Record<number, TimetableEntry>>;
  viewMode: string;
  userRole: string;
  subjects: Array<{ id: string; name: string; code: string }>;
  faculty: Array<{ id: string; name: string }>;
  rooms: Array<{ id: string; name: string; number: string }>;
  onCellEdit?: (entry: TimetableEntry) => void;
}

const PERIODS = [
  { id: 0, name: "P1", time: "8:00-8:50" },
  { id: 1, name: "P2", time: "8:50-9:40" },
  { id: 2, name: "P3", time: "9:40-10:30" },
  { id: 3, name: "P4", time: "10:50-11:40" },
  { id: 4, name: "P5", time: "11:40-12:30" },
  { id: 5, name: "P6", time: "1:50-2:40" },
  { id: 6, name: "P7", time: "2:40-3:30" },
  { id: 7, name: "P8", time: "3:30-4:20" },
];

const SUBJECT_COLORS = {
  "SUBJ001": "bg-blue-100 text-blue-800 border-blue-200",
  "SUBJ002": "bg-purple-100 text-purple-800 border-purple-200",
  "SUBJ003": "bg-green-100 text-green-800 border-green-200",
  "SUBJ004": "bg-orange-100 text-orange-800 border-orange-200",
  "SUBJ005": "bg-pink-100 text-pink-800 border-pink-200",
  "SUBJ006": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "SUBJ007": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "SUBJ008": "bg-teal-100 text-teal-800 border-teal-200",
  "SUBJ009": "bg-red-100 text-red-800 border-red-200",
  "SUBJ010": "bg-cyan-100 text-cyan-800 border-cyan-200",
};

export function TimetableGrid({
  timetableData,
  viewMode,
  userRole,
  subjects,
  faculty,
  rooms,
  onCellEdit,
}: TimetableGridProps) {
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId || s.code === subjectId);
    return subject?.name || subjectId;
  };

  const getFacultyName = (facultyId: string) => {
    const facultyMember = faculty.find(f => f.id === facultyId);
    return facultyMember?.name || `Faculty ${facultyId}`;
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room?.number || `Room ${roomId}`;
  };

  const getSubjectColorClass = (subjectId: string): string => {
    return SUBJECT_COLORS[subjectId as keyof typeof SUBJECT_COLORS] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const renderActionButtons = (entry: TimetableEntry) => {
    if (userRole === "student") return null;

    return (
      <div className="flex gap-1 mt-1">
        {userRole === "admin" || userRole === "hod" ? (
          <>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onCellEdit?.(entry)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Send className="h-3 w-3" />
            </Button>
          </>
        ) : userRole === "faculty" ? (
          <>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => onCellEdit?.(entry)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Submit for Approval">
              <Send className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <Eye className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  const renderTimetableCell = (rowKey: string, period: number) => {
    const entry = timetableData[rowKey]?.[period];
    
    if (!entry || entry.free) {
      return (
        <TableCell key={`${rowKey}-${period}`} className="h-20 border border-border/50">
          <div className="text-center text-muted-foreground text-sm">
            Free Period
          </div>
        </TableCell>
      );
    }

    const subjectName = getSubjectName(entry.subject);
    const facultyName = getFacultyName(entry.faculty);
    const roomName = getRoomName(entry.room);

    return (
      <TooltipProvider key={`${rowKey}-${period}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <TableCell className="h-20 border border-border/50 p-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <motion.div 
                className="space-y-1 h-full flex flex-col justify-between"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`text-xs px-2 py-1 rounded-md border ${getSubjectColorClass(entry.subject)} ${entry.is_lab ? 'bg-stripes' : ''}`}>
                  <div className="font-medium truncate">{subjectName}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="truncate">{facultyName.split(' ').slice(-1)[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{roomName}</span>
                    </div>
                    {entry.is_lab && (
                      <Badge variant="outline" className="text-xs">Lab</Badge>
                    )}
                  </div>
                </div>

                {renderActionButtons(entry)}
              </motion.div>
            </TableCell>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-3">
            <div className="space-y-2">
              <div className="font-semibold">{subjectName}</div>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{facultyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{roomName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Subject ID: {entry.subject}</span>
                </div>
                {entry.is_lab && (
                  <div className="text-xs text-muted-foreground">
                    * Laboratory Session
                  </div>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getRowLabel = (rowKey: string) => {
    switch (viewMode) {
      case "faculty":
        return getFacultyName(rowKey);
      case "room":
        return getRoomName(rowKey);
      default:
        return rowKey.toUpperCase();
    }
  };

  const getRowIcon = () => {
    switch (viewMode) {
      case "faculty":
        return <User className="h-4 w-4" />;
      case "room":
        return <MapPin className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (Object.keys(timetableData).length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No classes scheduled for this date</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-10 border-r-2 border-border w-32">
              <div className="flex items-center gap-2">
                {getRowIcon()}
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
              </div>
            </TableHead>
            {PERIODS.map((period) => (
              <TableHead key={period.id} className="text-center min-w-40 bg-muted/50">
                <div>
                  <div className="font-semibold">{period.name}</div>
                  <div className="text-xs text-muted-foreground">{period.time}</div>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(timetableData).sort().map((rowKey, index) => (
            <TableRow key={rowKey} className={index % 2 === 0 ? "bg-muted/10" : ""}>
              <TableCell className="sticky left-0 bg-background z-10 border-r-2 border-border font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {rowKey.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{getRowLabel(rowKey)}</div>
                    <div className="text-xs text-muted-foreground">{rowKey}</div>
                  </div>
                </div>
              </TableCell>
              {PERIODS.map((period) => renderTimetableCell(rowKey, period.id))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}