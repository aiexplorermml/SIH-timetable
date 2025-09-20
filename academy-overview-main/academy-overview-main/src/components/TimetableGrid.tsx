import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User, MapPin, BookOpen, Edit, Send } from "lucide-react";

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
  timetableData: Record<string, Record<number, TimetableEntry[]>>; // arrays
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
  SUBJ001: "bg-blue-100 text-blue-800 border-blue-200",
  SUBJ002: "bg-purple-100 text-purple-800 border-purple-200",
  SUBJ003: "bg-green-100 text-green-800 border-green-200",
  SUBJ004: "bg-orange-100 text-orange-800 border-orange-200",
  SUBJ005: "bg-pink-100 text-pink-800 border-pink-200",
  SUBJ006: "bg-indigo-100 text-indigo-800 border-indigo-200",
  SUBJ007: "bg-yellow-100 text-yellow-800 border-yellow-200",
  SUBJ008: "bg-teal-100 text-teal-800 border-teal-200",
  SUBJ009: "bg-red-100 text-red-800 border-red-200",
  SUBJ010: "bg-cyan-100 text-cyan-800 border-cyan-200",
  SUBJ011: "bg-emerald-100 text-emerald-800 border-emerald-200",
  SUBJ012: "bg-violet-100 text-violet-800 border-violet-200",
  SUBJ013: "bg-rose-100 text-rose-800 border-rose-200",
  SUBJ014: "bg-lime-100 text-lime-800 border-lime-200",
  SUBJ015: "bg-amber-100 text-amber-800 border-amber-200",
  SUBJ016: "bg-sky-100 text-sky-800 border-sky-200",
  SUBJ017: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  SUBJ018: "bg-stone-100 text-stone-800 border-stone-200",
  SUBJ019: "bg-slate-100 text-slate-800 border-slate-200",
  SUBJ020: "bg-zinc-100 text-zinc-800 border-zinc-200",
  SUBJ021: "bg-blue-100 text-blue-800 border-blue-200",
  SUBJ022: "bg-purple-100 text-purple-800 border-purple-200",
  SUBJ023: "bg-green-100 text-green-800 border-green-200",
  SUBJ024: "bg-orange-100 text-orange-800 border-orange-200",
  SUBJ025: "bg-pink-100 text-pink-800 border-pink-200",
  SUBJ026: "bg-indigo-100 text-indigo-800 border-indigo-200",
  SUBJ027: "bg-yellow-100 text-yellow-800 border-yellow-200",
  SUBJ028: "bg-teal-100 text-teal-800 border-teal-200",
  SUBJ029: "bg-red-100 text-red-800 border-red-200",
  SUBJ030: "bg-cyan-100 text-cyan-800 border-cyan-200",
  SUBJ031: "bg-emerald-100 text-emerald-800 border-emerald-200",
  SUBJ032: "bg-violet-100 text-violet-800 border-violet-200",
  SUBJ033: "bg-rose-100 text-rose-800 border-rose-200",
  SUBJ034: "bg-lime-100 text-lime-800 border-lime-200",
  SUBJ035: "bg-amber-100 text-amber-800 border-amber-200",
  SUBJ036: "bg-sky-100 text-sky-800 border-sky-200",
  SUBJ037: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  SUBJ038: "bg-stone-100 text-stone-800 border-stone-200",
  SUBJ039: "bg-slate-100 text-slate-800 border-slate-200",
  SUBJ040: "bg-zinc-100 text-zinc-800 border-zinc-200",
  SUBJ041: "bg-blue-100 text-blue-800 border-blue-200",
  SUBJ042: "bg-purple-100 text-purple-800 border-purple-200",
  SUBJ043: "bg-green-100 text-green-800 border-green-200",
  SUBJ044: "bg-orange-100 text-orange-800 border-orange-200",
  SUBJ045: "bg-pink-100 text-pink-800 border-pink-200",
  SUBJ046: "bg-indigo-100 text-indigo-800 border-indigo-200",
  SUBJ047: "bg-yellow-100 text-yellow-800 border-yellow-200",
  SUBJ048: "bg-teal-100 text-teal-800 border-teal-200",
  SUBJ049: "bg-red-100 text-red-800 border-red-200",
  SUBJ050: "bg-cyan-100 text-cyan-800 border-cyan-200",
  SUBJ051: "bg-emerald-100 text-emerald-800 border-emerald-200",
  SUBJ052: "bg-violet-100 text-violet-800 border-violet-200",
  SUBJ053: "bg-rose-100 text-rose-800 border-rose-200",
  SUBJ054: "bg-lime-100 text-lime-800 border-lime-200",
  SUBJ055: "bg-amber-100 text-amber-800 border-amber-200",
  SUBJ056: "bg-sky-100 text-sky-800 border-sky-200",
  SUBJ057: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  SUBJ058: "bg-stone-100 text-stone-800 border-stone-200",
  SUBJ059: "bg-slate-100 text-slate-800 border-slate-200",
  SUBJ060: "bg-zinc-100 text-zinc-800 border-zinc-200",
  SUBJ061: "bg-blue-100 text-blue-800 border-blue-200",
  SUBJ062: "bg-purple-100 text-purple-800 border-purple-200",
  SUBJ063: "bg-green-100 text-green-800 border-green-200",
  SUBJ064: "bg-orange-100 text-orange-800 border-orange-200",
  SUBJ065: "bg-pink-100 text-pink-800 border-pink-200",
  SUBJ066: "bg-indigo-100 text-indigo-800 border-indigo-200",
  SUBJ067: "bg-yellow-100 text-yellow-800 border-yellow-200",
  SUBJ068: "bg-teal-100 text-teal-800 border-teal-200",
  SUBJ069: "bg-red-100 text-red-800 border-red-200",
  SUBJ070: "bg-cyan-100 text-cyan-800 border-cyan-200",
  SUBJ071: "bg-emerald-100 text-emerald-800 border-emerald-200",
  SUBJ072: "bg-violet-100 text-violet-800 border-violet-200",
  SUBJ073: "bg-rose-100 text-rose-800 border-rose-200",
  SUBJ074: "bg-lime-100 text-lime-800 border-lime-200",
  SUBJ075: "bg-amber-100 text-amber-800 border-amber-200",
  SUBJ076: "bg-sky-100 text-sky-800 border-sky-200",
  SUBJ077: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
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
    const subject = subjects.find(
      (s) => s.id === subjectId || s.code === subjectId
    );
    return subject?.name || subjectId;
  };

  const getFacultyName = (facultyId: string) => {
    const facultyMember = faculty.find((f) => f.id === facultyId);
    return facultyMember?.name || `Faculty ${facultyId}`;
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room?.number || `Room ${roomId}`;
  };

  const getSubjectColorClass = (subjectId: string): string => {
    return (
      SUBJECT_COLORS[subjectId as keyof typeof SUBJECT_COLORS] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const renderActionButtons = (entry: TimetableEntry) => {
    if (userRole === "student") return null;

    return (
      <div className="flex gap-1 mt-1">
        {userRole === "admin" || userRole === "hod" ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => onCellEdit?.(entry)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Send className="h-3 w-3" />
            </Button>
          </>
        ) : userRole === "faculty" ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => onCellEdit?.(entry)}
          >
            <Edit className="h-3 w-3" />
          </Button>
        ) : null}
      </div>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-40">
            {viewMode === "faculty"
              ? "Faculty"
              : viewMode === "room"
              ? "Room"
              : "Section"}
          </TableHead>
          {PERIODS.map((period) => (
            <TableHead key={period.id}>
              <div className="font-medium">{period.name}</div>
              <div className="text-xs text-muted-foreground">{period.time}</div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(timetableData).map(([groupKey, periods]) => (
          <TableRow key={groupKey}>
            <TableCell className="font-medium">
              {viewMode === "faculty"
                ? getFacultyName(groupKey)
                : viewMode === "room"
                ? getRoomName(groupKey)
                : groupKey.toUpperCase()}
            </TableCell>
            {PERIODS.map((period) => (
              <TableCell key={groupKey + "-" + period.id} className="align-top">
                {periods[period.id] && periods[period.id].length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {periods[period.id].map((entry, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border ${getSubjectColorClass(
                          entry.subject
                        )}`}
                      >
                        <div className="font-medium text-sm">
                          {getSubjectName(entry.subject)}
                        </div>
                        <div className="text-xs flex flex-col gap-1">
                          {viewMode !== "faculty" && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {getFacultyName(entry.faculty)}
                            </span>
                          )}
                          {viewMode !== "room" && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {getRoomName(entry.room)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {entry.is_lab ? "Lab" : "Class"}
                          </span>
                        </div>
                        {renderActionButtons(entry)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Free</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
