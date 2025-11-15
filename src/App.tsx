import { Routes, Route } from "react-router-dom";
import { App as AntApp } from "antd";
import Login from "./pages/auth/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/share/ProtectedRoute";
import PermissionRoute from "./components/share/PermissionRoute";
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/account/Profile";
import AppointmentsPage from "./pages/appointments";
import FamilyPage from "./pages/family";
import DoctorAppointments from "./pages/doctor/appointments";
import DoctorsPage from "./pages/doctors";
import MedicalHistoryPage from "./pages/history";
import UnauthorizedPage from "./pages/unauthorized";
import AdminDashboard from "./pages/admin/dashboard";
import AdminUsers from "./pages/admin/users";

function App() {
  return (
    <AntApp>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route
            path="account/profile"
            element={
              <PermissionRoute permission="view_profile">
                <ProfilePage />
              </PermissionRoute>
            }
          />
          <Route
            path="appointments"
            element={
              <PermissionRoute permission="view_appointments">
                <AppointmentsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="family"
            element={
              <PermissionRoute permission="view_family">
                <FamilyPage />
              </PermissionRoute>
            }
          />
          <Route
            path="doctor/appointments"
            element={
              <PermissionRoute permission="view_doctor_appointments">
                <DoctorAppointments />
              </PermissionRoute>
            }
          />
          <Route
            path="doctors"
            element={
              <PermissionRoute permission="view_doctors">
                <DoctorsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="history"
            element={
              <PermissionRoute permission="view_history">
                <MedicalHistoryPage />
              </PermissionRoute>
            }
          />
          <Route
            path="admin/dashboard"
            element={
              <PermissionRoute permission="manage_users">
                <AdminDashboard />
              </PermissionRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <PermissionRoute permission="manage_users">
                <AdminUsers />
              </PermissionRoute>
            }
          />
        </Route>
      </Routes>
    </AntApp>
  );
}

export default App;
