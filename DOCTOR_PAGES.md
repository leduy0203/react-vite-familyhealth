# Hướng Dẫn Sử Dụng - Tính Năng Bác Sĩ

## Tổng Quan

Đã thêm 3 trang chính cho bác sĩ:

1. **Quản lý Bệnh nhân** (`/patients`)
2. **Quản lý Hồ sơ** (`/doctor/records`)  
3. **Lịch khám bệnh** (`/doctor/appointments`)

---

## 1. Quản Lý Bệnh Nhân (`/patients`)

### Tính năng:
- ✅ Hiển thị danh sách bệnh nhân dạng card với avatar
- ✅ Bộ lọc theo:
  - Tìm kiếm (tên, email, số điện thoại)
  - Giới tính
  - Nhóm máu
  - Trạng thái (đang điều trị/không hoạt động)
- ✅ Xem chi tiết bệnh nhân với 4 tab:
  - Thông tin cơ bản
  - Thông tin y tế (tiền sử, dị ứng, người liên hệ khẩn cấp)
  - Lịch sử khám
  - Ghi chú (bác sĩ có thể thêm/sửa)

### Components:
```
src/components/patients/
├── PatientCard.tsx              # Card hiển thị thông tin bệnh nhân
├── PatientDetailModal.tsx       # Modal chi tiết với tabs
└── PatientFilter.tsx            # Bộ lọc tìm kiếm
```

### Redux:
- **Slice**: `src/redux/slice/patientSlice.ts`
- **Actions**:
  - `fetchPatients()` - Lấy danh sách bệnh nhân
  - `getPatient(id)` - Lấy chi tiết 1 bệnh nhân
  - `updatePatientNotes({ id, notes })` - Cập nhật ghi chú

---

## 2. Quản Lý Hồ Sơ Bệnh Án (`/doctor/records`)

### Tính năng:
- ✅ Hiển thị danh sách hồ sơ được chuyển đến cho bác sĩ
- ✅ 4 tabs phân loại:
  - **Tất cả**: Tất cả hồ sơ
  - **Mới**: Hồ sơ mới chưa xem
  - **Đã xem**: Đã đánh dấu đã xem
  - **Đã xử lý**: Đã đề xuất lịch hẹn/kê đơn/đóng
- ✅ Tìm kiếm và lọc theo trạng thái
- ✅ Xem chi tiết hồ sơ với:
  - Thông tin bệnh nhân
  - Tóm tắt bệnh án
  - Tài liệu đính kèm
  - Ghi chú của bác sĩ (timeline)
  - Liên kết với lịch hẹn/đơn thuốc
- ✅ Đánh dấu đã xem + thêm ghi chú

### Components:
```
src/components/records/doctor/
├── RecordActionButtons.tsx      # Nút hành động (xem, đánh dấu, đề xuất...)
├── RecordStatusModal.tsx        # Modal đánh dấu đã xem + ghi chú
└── RecordDetailCard.tsx         # Card hiển thị chi tiết hồ sơ
```

### Trạng thái hồ sơ:
- `new` - Mới
- `transferred` - Đã chuyển
- `viewed` - Đã xem
- `appointment_suggested` - Đã đề xuất lịch hẹn
- `prescribed` - Đã kê đơn
- `closed` - Đã đóng
- `rejected` - Từ chối

---

## 3. Lịch Khám Bệnh (`/doctor/appointments`)

### Tính năng:
- ✅ Hiển thị lịch dạng Calendar với các lịch hẹn
- ✅ Thống kê:
  - Số lịch chờ xác nhận
  - Số lịch đã xác nhận
  - Số lịch hoàn thành
- ✅ 2 cột layout:
  - **Trái**: Calendar tháng
  - **Phải**: Danh sách lịch hẹn trong ngày được chọn
- ✅ Click vào lịch hẹn để xem chi tiết
- ✅ Cập nhật trạng thái:
  - **Xác nhận** (từ chờ xác nhận)
  - **Hoàn thành** (từ đã xác nhận)
  - **Hủy** (từ chờ xác nhận hoặc đã xác nhận)

### Components:
```
src/components/appointments/
└── AppointmentDetailCard.tsx    # Card chi tiết lịch hẹn + nút cập nhật
```

### Trạng thái lịch hẹn:
- `pending` - Chờ xác nhận
- `confirmed` - Đã xác nhận
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

---

## Cấu Trúc File

### Pages mới/cập nhật:
```
src/pages/
├── patients/
│   └── index.tsx                # Trang quản lý bệnh nhân
└── doctor/
    ├── appointments.tsx         # Trang lịch khám (đã cải thiện)
    └── records.tsx              # Trang quản lý hồ sơ (MỚI)
```

### Redux Store:
```
src/redux/slice/
└── patientSlice.ts              # Slice quản lý bệnh nhân (MỚI)
```

### API Mock:
```
src/config/api.ts
```
Đã thêm endpoints:
- `getPatients(opts?)` - Lấy danh sách bệnh nhân
- `getPatient(id)` - Chi tiết bệnh nhân
- `updatePatientNotes(id, notes)` - Cập nhật ghi chú

### Styles:
```
src/styles/
└── doctor.scss                  # Styles cho các trang bác sĩ (MỚI)
```

---

## Cách Sử Dụng

### 1. Đăng nhập với tài khoản bác sĩ:
```
Username: doctor
Password: <bất kỳ>
```

### 2. Truy cập các trang:
- **Bệnh nhân**: Menu → "Danh sách bệnh nhân" hoặc `/patients`
- **Hồ sơ**: Menu → "Quản lý hồ sơ" hoặc `/doctor/records`
- **Lịch hẹn**: Menu → "Lịch khám bệnh" hoặc `/doctor/appointments`

### 3. Quyền truy cập:
Tài khoản bác sĩ có các permissions:
- `view_patients` - Xem bệnh nhân
- `view_doctor_queue` - Xem hồ sơ được chuyển
- `mark_record_viewed` - Đánh dấu đã xem hồ sơ
- `view_appointments` - Xem lịch hẹn
- `create_appointment` - Tạo lịch hẹn
- `create_prescription` - Kê đơn thuốc

---

## Lưu Ý Kỹ Thuật

### Mock Data:
Hiện tại đang sử dụng mock API trong `src/config/api.ts`. Khi tích hợp backend thật:

1. **Thay thế các endpoint mock**:
   ```typescript
   // Ví dụ
   getPatients: async (opts) => {
     return axios.get('/api/doctor/patients', { params: opts });
   }
   ```

2. **Lấy doctorId từ auth context**:
   ```typescript
   // Thay vì hardcode "doctor"
   const doctorId = useSelector(state => state.account.user.id);
   ```

3. **Upload files thật**:
   - Thêm endpoint upload trong API
   - Cập nhật form để xử lý file upload

### Responsive:
- Tất cả trang đều responsive với Ant Design Grid
- Breakpoints: `xs` (mobile), `sm` (tablet), `lg` (desktop), `xl` (large desktop)

### Performance:
- Sử dụng `useEffect` với dependency array để tránh re-fetch không cần thiết
- Pagination cho bảng dữ liệu lớn
- Lazy loading cho modal chi tiết

---

## TODO - Tính Năng Nâng Cao

- [ ] Thêm tính năng đề xuất lịch hẹn từ hồ sơ
- [ ] Tích hợp kê đơn thuốc trực tiếp từ hồ sơ
- [ ] Export báo cáo bệnh nhân
- [ ] Thông báo realtime khi có hồ sơ mới
- [ ] Video call với bệnh nhân
- [ ] In đơn thuốc/lịch hẹn
- [ ] Gửi email/SMS nhắc lịch hẹn

---

## Troubleshooting

### Lỗi không hiển thị dữ liệu:
1. Kiểm tra đã dispatch `fetchPatients()` hoặc `fetchRecords()` chưa
2. Kiểm tra permission của user trong mock API
3. Mở DevTools → Network để xem API response

### Lỗi TypeScript:
1. Đảm bảo đã import đúng types từ `types/health.ts`
2. Kiểm tra Redux store đã add patientSlice chưa

### Styling không đúng:
1. Kiểm tra đã import `doctor.scss` trong `main.tsx`
2. Clear cache và rebuild: `npm run dev`

---

## Liên Hệ

Nếu có vấn đề hoặc cần hỗ trợ, hãy tạo issue trong repository.

---

**Created**: October 31, 2025  
**Version**: 1.0.0
