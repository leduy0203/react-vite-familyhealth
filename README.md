# 👨‍👩‍👧‍👦 FamilyHealth - Quản lý Sức khỏe Gia đình

Hệ thống quản lý sức khỏe gia đình với 3 vai trò: **Admin**, **Bác sĩ**, và **Bệnh nhân**.

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI Library:** Ant Design 5
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Styling:** SCSS Modules
- **Date Library:** Day.js
- **Backend API:** Spring Boot (Java)

## 📦 Cài đặt

```bash
# Clone repository
git clone <repo-url>

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
```

## 🔧 Cấu hình

Tạo file `.env` với nội dung:

```env
VITE_API_URL=http://localhost:8080/familyhealth/api/v1
```

## 🏃 Chạy dự án

```bash
# Development mode
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 🔐 Hệ thống phân quyền

### **ADMIN** (Quản trị viên)
- Quản lý người dùng
- Quản lý bác sĩ (CRUD)
- Xem thống kê hệ thống

### **DOCTOR** (Bác sĩ)
- Quản lý lịch khám bệnh
- Cập nhật kết quả khám
- Quản lý bệnh nhân

### **PATIENT** (Bệnh nhân)
- Quản lý thành viên gia đình
- Đặt lịch khám
- Xem kết quả khám bệnh

## 📚 Tài liệu

- [ROLE_SYSTEM.md](./ROLE_SYSTEM.md) - Chi tiết về hệ thống phân quyền
- [MENU_STRUCTURE.md](./MENU_STRUCTURE.md) - Cấu trúc menu và tính năng admin
- [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) - Lịch sử refactoring

## 🔑 Đăng nhập thử nghiệm

```
ADMIN:   admin / password
DOCTOR:  doctor / password  
PATIENT: patient / password
```

## 📁 Cấu trúc thư mục

```
src/
├── api/              # API configuration
├── components/       # Reusable components
│   ├── admin/       # Admin components
│   ├── layout/      # Layout components
│   └── share/       # Shared components
├── config/          # App configuration
├── constants/       # Constants & enums
├── pages/           # Page components
│   ├── admin/      # Admin pages
│   ├── doctor/     # Doctor pages
│   └── ...
├── redux/           # Redux store & slices
├── services/        # API services
├── styles/          # Global styles
└── types/           # TypeScript types
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add some AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Tạo Pull Request

## 📄 License

MIT License
