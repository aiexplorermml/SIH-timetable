import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import StudentEdit from "./pages/StudentEdit";
import Faculty from "./pages/Faculty";
import FacultyDetail from "./pages/FacultyDetail";
import FacultyEdit from "./pages/FacultyEdit";
import Curriculum from "./pages/Curriculum";
import NewsEvents from "./pages/NewsEvents";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrototypePage from "./pages/PrototypePage";
import SubjectsManagement from "./pages/SubjectsManagement";
import CurriculumSubjects from "./pages/CurriculumSubjects";
import SubjectMapping from "./pages/SubjectMapping";
import { FacultyManagement } from "./pages/FacultyManagement";
import { FacultyRegistration } from "./pages/FacultyRegistration";
import { FacultyView } from "./pages/FacultyView";
import { FacultyEditDetail } from "./pages/FacultyEditDetail";
import Rooms from "./pages/Rooms";
import DepartmentFaculty from "./pages/DepartmentFaculty";
import DepartmentSections from "./pages/DepartmentSections";
import DepartmentTimetable from "./pages/DepartmentTimetable";
import SemesterPlanning from "./pages/SemesterPlanning";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />

        {/* Global Public routes */}
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/:id/edit" element={<StudentEdit />} />

        {/* Department-based routes */}
        {/* AI&ML Department - Full functionality */}
        <Route path="/department/aiml" element={<Dashboard />} />
        <Route
          path="/department/aiml/faculty"
          element={<DepartmentFaculty />}
        />
        <Route
          path="/department/aiml/faculty/:id"
          element={<FacultyDetail />}
        />
        <Route
          path="/department/aiml/faculty/:id/edit"
          element={<FacultyEdit />}
        />
        <Route
          path="/department/aiml/sections"
          element={<DepartmentSections />}
        />
        <Route
          path="/department/aiml/sections/progress"
          element={<DepartmentSections />}
        />
        <Route
          path="/department/aiml/timetable"
          element={<DepartmentTimetable />}
        />
        <Route path="/department/aiml/curriculum" element={<Curriculum />} />
        <Route
          path="/department/aiml/curriculum/subjects"
          element={<CurriculumSubjects />}
        />
        <Route
          path="/department/aiml/curriculum/mapping"
          element={<SubjectMapping />}
        />

        <Route path="/department/aiml/news" element={<NewsEvents />} />

        {/* Other Departments - Prototype pages */}
        <Route path="/department/:department" element={<PrototypePage />} />
        <Route
          path="/department/:department/faculty"
          element={<DepartmentFaculty />}
        />
        <Route
          path="/department/:department/faculty/:id"
          element={<PrototypePage />}
        />
        <Route
          path="/department/:department/faculty/:id/edit"
          element={<PrototypePage />}
        />
        <Route
          path="/department/:department/sections"
          element={<DepartmentSections />}
        />
        <Route
          path="/department/:department/sections/progress"
          element={<DepartmentSections />}
        />
        <Route
          path="/department/:department/timetable"
          element={<DepartmentTimetable />}
        />
        <Route
          path="/department/:department/curriculum"
          element={<PrototypePage />}
        />
        <Route
          path="/department/:department/news"
          element={<PrototypePage />}
        />

        {/* Admin routes */}
        <Route path="/admin/subjects" element={<SubjectsManagement />} />
        <Route
          path="/admin/faculty-management"
          element={<FacultyManagement />}
        />
        <Route path="/admin/faculty-management/:id" element={<FacultyView />} />
        <Route
          path="/admin/faculty-management/:id/edit"
          element={<FacultyEditDetail />}
        />
        <Route path="/admin/semester-planning" element={<SemesterPlanning />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/faculty-registration" element={<FacultyRegistration />} />

        {/* Legacy routes for backward compatibility */}
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/faculty/:id" element={<FacultyDetail />} />
        <Route path="/faculty/:id/edit" element={<FacultyEdit />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/curriculum/subjects" element={<CurriculumSubjects />} />
        <Route path="/curriculum/mapping" element={<SubjectMapping />} />
        <Route path="/news" element={<NewsEvents />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
