# 📋 CẤU TRÚC MENU THEO ROLE

## 🔐 HỆ THỐNG PHÂN QUYỀN THEO ROLE

### **1. ADMIN**
- Role name: `"ADMIN"`
- Menu hiển thị:
  ```
  📊 Quản trị (Submenu)
    ├── 📈 Thống kê (/admin/dashboard)
    ├── 👥 Người dùng (/admin/users)
    └── 🩺 Quản lý bác sĩ (/admin/doctors) ⭐
  ```

### **2. DOCTOR**
- Role name: `"DOCTOR"`
- Menu hiển thị:
  ```
  🩺 Lịch khám bệnh (/doctor/appointments)
  ```

### **3. PATIENT**
- Role name: `"PATIENT"`
- Menu hiển thị:
  ```
  📊 Dashboard (/)
  👨‍👩‍👧‍👦 Thành viên (/family)
  📅 Lịch hẹn (/appointments)
  🩺 Danh sách bác sĩ (/doctors)
  📋 Kết quả khám (/history)
  ```

---

## 🆕 TRANG ADMIN QUẢN LÝ BÁC SĨ

### **Đường dẫn:** `/admin/doctors`

### **Tính năng:**

#### 1. **Danh sách bác sĩ (Table)**
- Cột hiển thị:
  - ID
  - Họ và tên
  - Giới tính (Tag với màu)
  - Chuyên khoa (Tag)
  - Email
  - CMND/CCCD
  - Ngày sinh
  - Hành động (Nút xem chi tiết)
- Phân trang: 10/20/50/100 bản ghi
- Tìm kiếm server-side theo tên
- Scroll ngang cho table rộng

#### 2. **Nút Thêm bác sĩ**
- Mở modal form với các trường:
  - **Thông tin tài khoản:**
    - Số điện thoại (10 chữ số, required)
    - Mật khẩu (≥8 ký tự, required)
    - Role_id = 2 (Doctor - auto)
  
  - **Thông tin cá nhân:**
    - Họ và tên (required)
    - CMND/CCCD (9-12 chữ số, required)
    - Giới tính (Male/Female/Other, required)
    - Ngày sinh (required, ≥18 tuổi)
    - Email (required, validation email)
    - Địa chỉ (required)
  
  - **Thông tin chuyên môn:**
    - Chuyên khoa (dropdown, required)
    - Tiểu sử (≥20 ký tự, required)

#### 3. **Modal xem chi tiết**
- Hiển thị đầy đủ thông tin bác sĩ
- Định dạng đẹp với Tag cho gender/expertise
- Nút đóng

---

## 🔧 API TÍCH HỢP

### **POST /api/v1/doctors**
**Payload:**
```json
{
  "phone": "0987654323",
  "password": "StrongPassword!2025",
  "role_id": 2,
  "fullname": "Pham Van Cong",
  "idCard": "002288000999",
  "address": "Tầng 5, Tòa nhà Y Tế, Quận 3, TP. Hồ Chí Minh",
  "gender": "FEMALE",
  "dateOfBirth": "1990-10-25",
  "email": "phamthib@clinic.vn",
  "expertise": "HO_HAP",
  "bio": "Chuyên gia Nội khoa với 10 năm kinh nghiệm..."
}
```

**Response:**
```json
{
  "code": 201,
  "message": "Create doctor successfully."
}
```

### **GET /api/v1/doctors**
- Pagination: `page`, `pageSize`
- Search: `search`

---

## 📁 FILES CREATED/UPDATED

### **Created:**
- `src/pages/admin/doctors/index.tsx` - Trang admin quản lý bác sĩ

### **Updated:**
- `src/config/permissions.ts` - Chuyển từ permission-based sang role-based
- `src/components/share/PermissionRoute.tsx` - Đổi từ `permission` sang `role`
- `src/components/share/Access.tsx` - Đổi từ `permission` sang `role`
- `src/App.tsx` - Cập nhật routes với role-based authorization
- `src/services/doctorService.ts` - Thêm method `create()`
- `src/components/layout/DashboardLayout.tsx` - Sắp xếp menu theo 3 roles
- `package.json` - Thêm dayjs dependency

## 🔄 THAY ĐỔI QUAN TRỌNG

### **Trước (Permission-based):**
```tsx
<PermissionRoute permission="manage_users">
  <AdminDashboard />
</PermissionRoute>
```

### **Sau (Role-based):**
```tsx
<PermissionRoute role="ADMIN">
  <AdminDashboard />
</PermissionRoute>
```

### **Helper Functions:**
```typescript
// Old
hasPermission(user, "manage_users")

// New
hasRole(user, "ADMIN")
hasRole(user, ["ADMIN", "DOCTOR"]) // Multiple roles
```

---

## 🎯 SỰ KHÁC BIỆT

| Tính năng | `/doctors` (Patient) | `/admin/doctors` (Admin) |
|-----------|---------------------|--------------------------|
| **Mục đích** | Xem danh sách bác sĩ, đặt lịch | Quản lý bác sĩ |
| **UI** | List Card, hiển thị chi tiết bio | Table compact, chỉ info chính |
| **Chức năng** | Xem, Đặt lịch, Chi tiết | Xem, Thêm mới, Chi tiết |
| **Role** | `PATIENT` | `ADMIN` |
| **Thêm mới** | ❌ | ✅ Modal form |

---

## 🚀 NEXT STEPS

- [ ] Thêm chức năng **Sửa bác sĩ** (Edit modal)
- [ ] Thêm chức năng **Xóa bác sĩ** (Soft delete)
- [ ] Thêm filter theo chuyên khoa trong admin
- [ ] Thêm export Excel danh sách bác sĩ
- [ ] Thêm upload avatar cho bác sĩ
- [ ] Tích hợp permissions động từ backend

---

**Status:** ✅ Hoàn thành  
**Version:** 1.0  
**Last Updated:** 2025-11-16 23:45
