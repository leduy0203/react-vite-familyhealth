import React, { useEffect } from "react";
import { Card, Breadcrumb, Space, Typography } from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchUsers } from "../../../redux/slice/userSlice";
import StatsCards from "../../../components/admin/dashboard/StatsCards";
import Charts from "../../../components/admin/dashboard/Charts";
import RecentActivity from "../../../components/admin/dashboard/RecentActivity";
import "../../../styles/admin.scss";

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: users } = useAppSelector((s) => s.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalDoctors: users.filter((u) => u.role.id === "doctor").length,
    totalPatients: users.filter((u) => u.role.id === "user").length,
    totalAppointments: 90, // Mock data - replace with real data
    newAppointmentsToday: 5, // Mock data - replace with real data
    newRecordsToday: 3, // Mock data - replace with real data
  };

  // Mock data for charts (replace with real data from API)
  const appointmentsByMonth = [
    { month: "T1", count: 45 },
    { month: "T2", count: 52 },
    { month: "T3", count: 48 },
    { month: "T4", count: 61 },
    { month: "T5", count: 55 },
    { month: "T6", count: 67 },
  ];

  const appointmentsByStatus = {
    pending: 12,
    confirmed: 25,
    completed: 45,
    cancelled: 8,
  };

  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      type: "appointment",
      message: "Lịch hẹn mới được tạo bởi Nguyễn Văn A",
      time: "5 phút trước",
      icon: "calendar",
    },
    {
      id: 2,
      type: "record",
      message: "Hồ sơ bệnh án mới được tạo cho Trần Thị B",
      time: "15 phút trước",
      icon: "file",
    },
    {
      id: 3,
      type: "user",
      message: "Người dùng mới đăng ký: Lê Văn C",
      time: "30 phút trước",
      icon: "user",
    },
    {
      id: 4,
      type: "appointment",
      message: "Lịch hẹn được xác nhận bởi BS. Phạm Minh D",
      time: "1 giờ trước",
      icon: "check",
    },
    {
      id: 5,
      type: "doctor",
      message: "Bác sĩ mới tham gia: BS. Hoàng Thị E",
      time: "2 giờ trước",
      icon: "doctor",
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Breadcrumb */}
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <DashboardOutlined />
                  <span>Admin Dashboard</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Header */}
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Space align="center">
          <DashboardOutlined style={{ fontSize: 28, color: "#1890ff" }} />
          <Title level={2} style={{ margin: 0 }}>
            Admin Dashboard
          </Title>
        </Space>
        <Typography.Text type="secondary">
          Tổng quan hệ thống quản lý sức khỏe gia đình
        </Typography.Text>
      </Card>

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <Charts
        appointmentsByMonth={appointmentsByMonth}
        appointmentsByStatus={appointmentsByStatus}
      />

      {/* Recent Activity */}
      <RecentActivity activities={activities} />
    </div>
  );
};

export default AdminDashboard;
