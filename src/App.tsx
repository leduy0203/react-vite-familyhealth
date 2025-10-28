import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/share/ProtectedRoute";
import PermissionRoute from "./components/share/PermissionRoute";
import DashboardPage from "./pages/dashboard";
import RecordsPage from "./pages/records";
import PatientsPage from "./pages/patients";
import ProfilePage from "./pages/account/Profile";
import AppointmentsPage from "./pages/appointments";
import FamilyPage from "./pages/family";
import PrescriptionsPage from "./pages/prescriptions";
import DoctorAppointments from "./pages/doctor/appointments";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

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
              <PermissionRoute permission={["view_family", "view_records"]}>
                <FamilyPage />
              </PermissionRoute>
            }
          />
          <Route
            path="prescriptions"
            element={
              <PermissionRoute permission="view_prescriptions">
                <PrescriptionsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="doctor/appointments"
            element={
              <PermissionRoute permission="view_appointments">
                <DoctorAppointments />
              </PermissionRoute>
            }
          />
          <Route
            path="records"
            element={
              <PermissionRoute permission="view_records">
                <RecordsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="patients"
            element={
              <PermissionRoute permission="view_patients">
                <PatientsPage />
              </PermissionRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
