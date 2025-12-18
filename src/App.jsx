import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EmployeeManagementPage from "./views/Admin/Monitoring/EmployeeManagementPage";
import AttendanceMonitoringPage from "./views/Admin/Monitoring/AttendanceMonitoringPage";
import EmployeeDetailPage from "./views/Admin/Monitoring/EmployeeDetailPage";
import LoginPage from "./views/LoginPage";
import AttendanceHistoryPage from "./views/Attendance/AttendanceHistoryPage";
import ProtectedRoute from "./ProtectedRoute";
import AttendancePage from "./views/Attendance/AttendancePage";
import NotFoundPage from "./views/NotFoundPage";
import TestPage2 from "./views/TestPage2";

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<TestPage2 />} />
          
           {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/employee" element={<EmployeeManagementPage />} />
            <Route path="/admin/employee-attendance" element={<AttendanceMonitoringPage />} />
            <Route path="/admin/employee-detail/:id" element={<EmployeeDetailPage />} />
          </Route>

          {/* Employee or Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "employee"]} />}>
            <Route path="/attendance-history" element={<AttendanceHistoryPage />} />
            <Route path="/absence" element={<AttendancePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Router>
    </HelmetProvider>
  );
}
