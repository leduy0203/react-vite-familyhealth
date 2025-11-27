import React, { useEffect, useState } from "react";
import { Card, Breadcrumb, Space, Typography, Button, message, Spin } from "antd";
import {
  HomeOutlined,
  DashboardOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchUsers } from "../../../redux/slice/userSlice";
import { doctorService } from "../../../services/doctorService";
import { appointmentService } from "../../../services/appointmentService";
import { familyService } from "../../../services/familyService";
import StatsCards from "../../../components/admin/dashboard/StatsCards";
import Charts from "../../../components/admin/dashboard/Charts";
import RecentActivity from "../../../components/admin/dashboard/RecentActivity";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import "../../../styles/admin.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title } = Typography;

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  newAppointmentsToday: number;
  newRecordsToday: number;
}

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: users } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    newAppointmentsToday: 0,
    newRecordsToday: 0,
  });
  const [appointmentsByMonth, setAppointmentsByMonth] = useState<Array<{ month: string; count: number }>>([]);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [activities, setActivities] = useState<Array<any>>([]);

  useEffect(() => {
    dispatch(fetchUsers());
    loadDashboardData();
  }, [dispatch]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [doctorsRes, appointmentsRes, membersRes] = await Promise.all([
        doctorService.getList({ page: 0, pageSize: 1000 }),
        appointmentService.getAll(),
        familyService.getList({ page: 0, size: 1000 }),
      ]);

      const doctors = doctorsRes.data.result;
      const appointments = appointmentsRes.data.result;
      const members = membersRes.data.result;

      // Calculate statistics
      const today = dayjs().startOf('day');
      const newAppointmentsToday = appointments.filter(apt => 
        dayjs(apt.createdAt).isAfter(today)
      ).length;

      // Since members don't have createdAt, use count as alternative
      const newMembersToday = 0; // Will be updated when API supports this

      // Count appointments by status
      const statusCounts = {
        pending: appointments.filter(a => a.status === 'SCHEDULED').length,
        confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
        completed: appointments.filter(a => a.status === 'COMPLETED').length,
        cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
      };

      // Group appointments by month (last 6 months)
      const monthData: { [key: string]: number } = {};
      const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      
      for (let i = 5; i >= 0; i--) {
        const month = dayjs().subtract(i, 'month');
        const monthKey = monthNames[month.month()];
        monthData[monthKey] = 0;
      }

      appointments.forEach(apt => {
        const aptDate = dayjs(apt.time || apt.appointmentDate);
        const monthKey = monthNames[aptDate.month()];
        if (monthData.hasOwnProperty(monthKey)) {
          monthData[monthKey]++;
        }
      });

      const chartData = Object.entries(monthData).map(([month, count]) => ({
        month,
        count,
      }));

      // Generate recent activities from appointments
      const recentActivities = appointments
        .sort((a, b) => {
          const dateA = dayjs(a.createdAt || a.time);
          const dateB = dayjs(b.createdAt || b.time);
          return dateB.valueOf() - dateA.valueOf();
        })
        .slice(0, 5)
        .map(apt => ({
          id: `apt-${apt.id}`,
          type: 'appointment',
          message: `Lịch hẹn mới với BS. ${apt.doctor?.fullName || 'Bác sĩ'}`,
          time: dayjs(apt.createdAt || apt.time).fromNow(),
          icon: 'calendar',
        }));

      setStats({
        totalUsers: users.length,
        totalDoctors: doctors.length,
        totalPatients: members.length,
        totalAppointments: appointments.length,
        newAppointmentsToday,
        newRecordsToday: newMembersToday,
      });

      setAppointmentsByMonth(chartData);
      setAppointmentsByStatus(statusCounts);
      setActivities(recentActivities);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Update stats when users change
  useEffect(() => {
    if (users.length > 0) {
      setStats(prev => ({
        ...prev,
        totalUsers: users.length,
        totalDoctors: users.filter((u) => u.role.id === "doctor").length,
      }));
    }
  }, [users]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
      </div>
    );
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Space align="center">
              <DashboardOutlined style={{ fontSize: 28, color: "#1890ff" }} />
              <Title level={2} style={{ margin: 0 }}>
                Admin Dashboard
              </Title>
            </Space>
            <Typography.Text type="secondary">
              Tổng quan hệ thống quản lý sức khỏe gia đình
            </Typography.Text>
          </div>
          <Space>
            <Button
              icon={<DashboardOutlined />}
              onClick={loadDashboardData}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => message.success('Chức năng xuất báo cáo đang được phát triển')}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Xuất báo cáo
            </Button>
          </Space>
        </div>
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
