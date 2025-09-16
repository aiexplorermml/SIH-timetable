from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from datetime import date



# -------------------------
# Semester & Calendar Models
# -------------------------

class SemesterDate(BaseModel):
    id: str
    name: str
    startDate: date
    endDate: date
    totalHours: int
    theoryHours: int
    practicalHours: int


class ExamDate(BaseModel):
    id: str
    semesterId: str
    startDate: date
    endDate: date


class Holiday(BaseModel):
    holiday_date: date
    description: str


# -------------------------
# Subjects & Curriculum
# -------------------------

class Topic(BaseModel):
    id: str
    name: str
    description: Optional[str]
    theoryHours: Optional[int]
    referenceMaterials: Optional[List[str]] = []


class SubjectMaster(BaseModel):
    id: str
    code: Optional[str] = None
    name: str
    description: Optional[str] = None
    totalHours: int
    credits: Optional[int] = 5
    prerequisites: Optional[List[str]] = []
    topics: Optional[List[Topic]] = []
    is_lab: bool = False
    assigned_faculty_id: Optional[str] = None





class ElectiveGroup(BaseModel):
    subjects: List[SubjectMaster]


class SemesterSubjectsEntry(BaseModel):
    subjects: List[SubjectMaster]
    electives: Dict[str, ElectiveGroup]


# -------------------------
# Faculty & Sections
# -------------------------

class Faculty(BaseModel):
    id: str
    name: str
    facultyId: str
    department: str
    qualification: str
    contact: Optional[str]
    email: Optional[str]
    status: str
    joiningDate: date
    experience: int
    specialization: List[str]
    subjects: List[str]
    address: Optional[str]
    designations: List[str]
    # Extra fields like research, degrees ignored for timetable

class FacultyWorkloadMetrics(BaseModel):
    facultyDetails: Faculty
    periods_available: int
    max_possible_periods: int
    actual_allocated_periods: int

    # Derived / read-only properties
    @property
    def free_periods(self) -> int:
        return max(0, self.periods_available - self.actual_allocated_periods)

    @property
    def max_possible_utilization(self) -> float:
        return (100 * self.max_possible_periods / self.periods_available) if self.periods_available > 0 else 0.0

    @property
    def actual_utilization(self) -> float:
        return (100 * self.actual_allocated_periods / self.periods_available) if self.periods_available > 0 else 0.0


class Section(BaseModel):
    id: str
    name: str
    year: int
    section: str
    semester: str
    totalStudents: int
    classTeacher: Optional[str] = None

class NormalizedSection(Section):
    subjects: List[SubjectMaster]
    mapped_classroom: Optional[str] = None
    is_virtual: bool = False
    elective_group: Optional[str] = None

class NormalizedSectionSchedule(NormalizedSection):
    schedule: Dict[str, List[int]]  # day -> list of time slots


# -------------------------
# Classrooms
# -------------------------

class Classroom(BaseModel):
    id: str
    name: str
    number: str
    type: str
    capacity: int
    floor: Optional[int]
    building: Optional[str]
    department: Optional[str]
    description: Optional[str]
    amenities: Optional[List[str]]
    status: Optional[str]


# -------------------------
# Elective Enrollments
# -------------------------

class ElectiveSubjectChoice(BaseModel):
    subject_id: str
    name: str
    hours: int
    is_lab: bool
    studentsEnrolled: int


class ElectiveEnrollment(BaseModel):
    sectionId: str = Field(..., alias="section_id")
    sectionName: str
    semester: str
    totalStudents: int
    electiveGroup: str = Field(..., alias="elective_group")
    subjects: List[ElectiveSubjectChoice]
