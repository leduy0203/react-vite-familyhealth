import { Routes, Route, Navigate } from "react-router-dom";
import { App as AntApp } from "antd";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/share/ProtectedRoute";
import PermissionRoute from "./components/share/PermissionRoute";
import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/account/Profile";
import AppointmentsPage from "./pages/appointments";
import FamilyPage from "./pages/family";
import DoctorAppointments from "./pages/doctor/appointments";
import DoctorConfirmedAppointments from "./pages/doctor/confirmed-appointments";
import DoctorPatientsList from "./pages/doctor/DoctorPatientsList";
import DoctorPatientHistory from "./pages/doctor/DoctorPatientHistory";
import DoctorMedicalHistory from "./pages/doctor/DoctorMedicalHistory";
import DoctorsPage from "./pages/doctors";
import MedicalHistoryPage from "./pages/history";
import MedicalRecordsPage from "./pages/medical-records";
import UnauthorizedPage from "./pages/unauthorized";
import AdminDashboard from "./pages/admin/dashboard";
import AdminUsers from "./pages/admin/users";
import AdminDoctors from "./pages/admin/doctors";
import AdminHouseholds from "./pages/admin/households";

function App() {
  return (
    <AntApp>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          <Route path="account/profile" element={<ProfilePage />} />
          
          {/* PATIENT & PATIENT_HOUSEHOLD Routes */}
          <Route
            path="appointments"
            element={
              <PermissionRoute role={["PATIENT", "PATIENT_HOUSEHOLD"]}>
                <AppointmentsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="family"
            element={
              <PermissionRoute role={["PATIENT", "PATIENT_HOUSEHOLD"]}>
                <FamilyPage />
              </PermissionRoute>
            }
          />
          <Route
            path="doctors"
            element={
              <PermissionRoute role={["PATIENT", "PATIENT_HOUSEHOLD"]}>
                <DoctorsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="history"
            element={
              <PermissionRoute role={["PATIENT", "PATIENT_HOUSEHOLD"]}>
                <MedicalHistoryPage />
              </PermissionRoute>
            }
          />
          <Route
            path="medical-records"
            element={
              <PermissionRoute role={["PATIENT", "PATIENT_HOUSEHOLD"]}>
                <MedicalRecordsPage />
              </PermissionRoute>
            }
          />

          {/* DOCTOR Routes */}
          <Route path="doctor" element={<Navigate to="/doctor/appointments" replace />} />
          <Route
            path="doctor/appointments"
            element={
              <PermissionRoute role="DOCTOR">
                <DoctorAppointments />
              </PermissionRoute>
            }
          />
          <Route
            path="doctor/confirmed-appointments"
            element={
              <PermissionRoute role="DOCTOR">
                <DoctorConfirmedAppointments />
              </PermissionRoute>
            }
          />
          <Route
            path="doctor/patients"
            element={
              <PermissionRoute role="DOCTOR">
                <DoctorPatientsList />
              </PermissionRoute>
            }
          />
          <Route
            path="doctor/patient-history/:memberId"
            element={
              <PermissionRoute role="DOCTOR">
                <DoctorPatientHistory />
              </PermissionRoute>
            }
          />
          <Route
            path="doctor/medical-history"
            element={
              <PermissionRoute role="DOCTOR">
                <DoctorMedicalHistory />
              </PermissionRoute>
            }
          />

          {/* ADMIN Routes */}
          <Route
            path="admin/dashboard"
            element={
              <PermissionRoute role="ADMIN">
                <AdminDashboard />
              </PermissionRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <PermissionRoute role="ADMIN">
                <AdminUsers />
              </PermissionRoute>
            }
          />
          <Route
            path="admin/doctors"
            element={
              <PermissionRoute role="ADMIN">
                <AdminDoctors />
              </PermissionRoute>
            }
          />
          <Route
            path="admin/households"
            element={
              <PermissionRoute role="ADMIN">
                <AdminHouseholds />
              </PermissionRoute>
            }
          />
        </Route>
      </Routes>
    </AntApp>
  );
}

export default App;
