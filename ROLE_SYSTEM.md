# 🔐 HỆ THỐNG PHÂN QUYỀN THEO ROLE

## 📌 TỔNG QUAN

Hệ thống đã chuyển từ **permission-based** sang **role-based authorization** để đơn giản hóa quản lý quyền.

---

## 🎭 3 ROLES TRONG HỆ THỐNG

### 1. **ADMIN**
```typescript
role: { name: "ADMIN" }
```
**Quyền truy cập:**
- ✅ Tất cả trang quản trị (`/admin/*`)
- ✅ Thống kê tổng quan
- ✅ Quản lý người dùng
- ✅ Quản lý bác sĩ (Thêm/Xem/Sửa/Xóa)

**Menu:**
```
📊 Quản trị
  ├── Thống kê
  ├── Người dùng
  └── Quản lý bác sĩ
```

---

### 2. **DOCTOR**
```typescript
role: { name: "DOCTOR" }
```
**Quyền truy cập:**
- ✅ Lịch khám bệnh của bác sĩ (`/doctor/appointments`)
- ✅ Xem/Cập nhật lịch hẹn
- ✅ Thêm kết quả khám

**Menu:**
```
🩺 Lịch khám bệnh
```

---

### 3. **PATIENT**
```typescript
role: { name: "PATIENT" }
```
**Quyền truy cập:**
- ✅ Dashboard cá nhân
- ✅ Quản lý thành viên gia đình
- ✅ Đặt lịch hẹn
- ✅ Xem danh sách bác sĩ
- ✅ Xem kết quả khám bệnh

**Menu:**
```
📊 Dashboard
👨‍👩‍👧‍👦 Thành viên
📅 Lịch hẹn
🩺 Danh sách bác sĩ
📋 Kết quả khám
```

---

## 🛠️ CÁCH SỬ DỤNG

### **1. Trong Component (Route Protection)**

```tsx
import PermissionRoute from "./components/share/PermissionRoute";

// Chỉ ADMIN được truy cập
<Route
  path="admin/doctors"
  element={
    <PermissionRoute role="ADMIN">
      <AdminDoctors />
    </PermissionRoute>
  }
/>

// Chỉ PATIENT được truy cập
<Route
  path="family"
  element={
    <PermissionRoute role="PATIENT">
      <FamilyPage />
    </PermissionRoute>
  }
/>

// Multiple roles (ADMIN hoặc DOCTOR)
<PermissionRoute role={["ADMIN", "DOCTOR"]}>
  <SomeComponent />
</PermissionRoute>
```

---

### **2. Trong Component (Conditional Rendering)**

```tsx
import { hasRole } from "../../config/permissions";
import { useAppSelector } from "../../redux/hooks";

const MyComponent = () => {
  const user = useAppSelector(s => s.account.user);

  return (
    <>
      {hasRole(user, "ADMIN") && (
        <Button>Chỉ Admin thấy</Button>
      )}

      {hasRole(user, ["ADMIN", "DOCTOR"]) && (
        <Button>Admin hoặc Doctor thấy</Button>
      )}

      {hasRole(user, "PATIENT") && (
        <Button>Chỉ Patient thấy</Button>
      )}
    </>
  );
};
```

---

### **3. Sử dụng Access Component**

```tsx
import Access from "./components/share/Access";

// Hide component nếu không có quyền
<Access role="ADMIN" hideChildren>
  <AdminPanel />
</Access>

// Redirect về /unauthorized nếu không có quyền
<Access role="DOCTOR">
  <DoctorDashboard />
</Access>
```

---

## 📂 STRUCTURE

```
src/
├── config/
│   └── permissions.ts          # hasRole() helper
├── components/
│   └── share/
│       ├── PermissionRoute.tsx # Route protection
│       └── Access.tsx          # Component-level access
├── redux/
│   └── slice/
│       └── accountSlice.ts     # User state với role
└── App.tsx                     # Routes với role protection
```

---

## 🔄 MIGRATION NOTES

### **Trước đây (Permission-based):**
```tsx
// Phải check nhiều permissions
hasPermission(user, "view_dashboard")
hasPermission(user, "view_appointments")
hasPermission(user, "manage_users")

// Props
<PermissionRoute permission="manage_users">
```

### **Bây giờ (Role-based):**
```tsx
// Chỉ cần check role
hasRole(user, "ADMIN")
hasRole(user, "PATIENT")
hasRole(user, "DOCTOR")

// Props
<PermissionRoute role="ADMIN">
```

---

## ✅ LỢI ÍCH

1. **Đơn giản hơn:** 3 roles thay vì 10+ permissions
2. **Rõ ràng hơn:** Dễ hiểu ai có quyền gì
3. **Dễ maintain:** Thêm tính năng chỉ cần gán role
4. **Performance:** Ít logic check hơn
5. **Backend sync:** Khớp với DB schema (roles table)

---

## 🚨 LƯU Ý

- User **PHẢI** có `role.name` trong Redux state
- Role name **PHẢI** viết HOA: `"ADMIN"`, `"DOCTOR"`, `"PATIENT"`
- Nếu role không khớp → redirect về `/unauthorized`
- Component `PermissionRoute` vẫn giữ tên cũ (backward compatibility)

---

## 🧪 TESTING

```typescript
// Mock user trong test
const mockAdminUser = {
  id: "1",
  name: "Admin User",
  role: { id: "1", name: "ADMIN" }
};

const mockPatientUser = {
  id: "2",
  name: "Patient User",
  role: { id: "3", name: "PATIENT" }
};

// Test hasRole
expect(hasRole(mockAdminUser, "ADMIN")).toBe(true);
expect(hasRole(mockPatientUser, "ADMIN")).toBe(false);
```

---

**Version:** 2.0  
**Updated:** 2025-11-16  
**Breaking Changes:** ⚠️ Yêu cầu cập nhật tất cả `permission` props thành `role`
