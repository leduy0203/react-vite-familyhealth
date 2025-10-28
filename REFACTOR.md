# Kế hoạch Tái cấu trúc (Refactoring) Project FamilyHealth

## Lý do

Cấu trúc thư mục hiện tại của dự án `react-vite-familyhealth` đã bắt đầu trở nên phức tạp và khó điều hướng khi dự án phát triển. So với dự án tham khảo (`03-react-vite-jobhunter-master`), cấu trúc của chúng ta có thể được cải thiện để trở nên rõ ràng, module hóa và dễ bảo trì hơn.

Mục tiêu của việc tái cấu trúc này là:

- Tăng tính rõ ràng và dễ tìm kiếm file.
- Giảm sự phụ thuộc chéo giữa các module.
- Tạo ra một cấu trúc có khả năng mở rộng tốt hơn trong tương lai.
- Học hỏi các thực hành tốt nhất từ dự án `jobhunter`.

**Lưu ý:** Quá trình này chỉ tập trung vào việc di chuyển và sắp xếp lại file, **không thay đổi logic nghiệp vụ** của ứng dụng.

## Kế hoạch thực hiện

### Giai đoạn 1: Chuẩn bị và Tái cấu trúc nền tảng (Non-breaking)

1.  **Tạo Lớp API Adapter (`src/api`)**:

    - Tạo file `src/api/index.ts` để làm một lớp trung gian (adapter) cho `config/api.ts`.
    - File này sẽ export các đối tượng API đã được phân chia theo chức năng (ví dụ: `authApi`, `recordsApi`, `appointmentsApi`).
    - Mục đích: Giúp các thành phần trong ứng dụng không phụ thuộc trực tiếp vào file `config/api.ts` monlithic, dễ dàng cho việc thay thế hoặc tách nhỏ API sau này.

2.  **Tập trung hóa Permissions (`src/config/permissions.ts`)**:
    - Tạo file `config/permissions.ts` để định nghĩa tất cả các key quyền (permission keys) dưới dạng hằng số.
    - Cập nhật file `config/api.ts` và các component (như `DashboardLayout`, `PermissionRoute`) để sử dụng các hằng số này thay vì chuỗi ký tự.
    - Mục đích: Tránh lỗi chính tả và quản lý tập trung các quyền của hệ thống.

### Giai đoạn 2: Tái cấu trúc theo "Features"

1.  **Tạo thư mục `src/features`**:

    - Đây sẽ là nơi chứa code cho các chức năng chính của ứng dụng.
    - Mỗi feature sẽ có một thư mục riêng, ví dụ: `src/features/account`, `src/features/records`, `src/features/appointments`.

2.  **Di chuyển Redux Slices**:

    - Di chuyển các file slice từ `src/redux/slice` vào thư mục feature tương ứng.
    - Ví dụ: `src/redux/slice/accountSlice.ts` -> `src/features/account/accountSlice.ts`.
    - Cập nhật `src/redux/store.ts` để import từ vị trí mới.

3.  **Di chuyển Types liên quan**:
    - Các kiểu dữ liệu (types) trong `src/types/backend.d.ts` và `health.ts` sẽ được di chuyển vào thư mục feature tương ứng nếu chúng chỉ thuộc về feature đó. Các type dùng chung sẽ được giữ lại ở `src/types`.

### Giai đoạn 3: Dọn dẹp UI (Components & Pages)

1.  **Tái cấu trúc `src/pages`**:

    - Nhóm các trang theo vai trò hoặc luồng nghiệp vụ lớn, tương tự `jobhunter`.
    - Ví dụ: `pages/patient/`, `pages/doctor/`, `pages/shared/`.

2.  **Tái cấu trúc `src/components`**:
    - Phân loại các component thành các thư mục con tương ứng với features hoặc vai trò.
    - Ví dụ: `components/records/`, `components/appointments/`.
    - Các component dùng chung cho toàn bộ ứng dụng sẽ được đặt trong `components/share/`.

### Giai đoạn 4: Hoàn tất và Kiểm tra

1.  **Rà soát và sửa lỗi import**: Sau khi di chuyển file, sẽ có nhiều đường dẫn import bị lỗi. Cần rà soát toàn bộ dự án để cập nhật.
2.  **Kiểm tra toàn diện (Smoke Test)**:
    - Chạy lại ứng dụng ở môi trường dev.
    - Thực hiện các luồng chính: Đăng nhập (với 3 vai trò), xem danh sách hồ sơ, tạo hồ sơ, chuyển hồ sơ cho bác sĩ, bác sĩ xem hồ sơ, bác sĩ tạo lịch hẹn.
    - Đảm bảo mọi thứ hoạt động như cũ.
