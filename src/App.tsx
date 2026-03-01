import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StudentsPage } from "./pages/StudentsPage";
import { DepartmentsPage } from "./pages/DepartmentsPage";
import { CoursesPage } from "./pages/CoursesPage";
import { SectionsPage } from "./pages/SectionsPage";
import { EnrollmentPage } from "./pages/EnrollmentPage";
import { GradesPage } from "./pages/GradesPage";
import { AttendancePage } from "./pages/AttendancePage";
import { FeesPage } from "./pages/FeesPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ExamsPage } from "./pages/ExamsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/sections" element={<SectionsPage />} />
          <Route path="/enrollment" element={<EnrollmentPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/exams" element={<ExamsPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
