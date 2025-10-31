import React, { useEffect, useState } from "react";
import { Card, Space, Typography, Breadcrumb, Spin, Row, Col } from "antd";
import { HomeOutlined, DashboardOutlined } from "@ant-design/icons";
import StatsCards from "../../components/admin/dashboard/StatsCards";
import Charts from "../../components/admin/dashboard/Charts";
import RecentActivity from "../../components/admin/dashboard/RecentActivity";
import { api } from "../../config/api";

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getSystemStats();
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
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
                  <span>Dashboard</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Header */}
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Space align="center">
          <DashboardOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={3} style={{ margin: 0 }}>
            Tổng Quan Hệ Thống
          </Title>
        </Space>
      </Card>

      {/* Stats Cards */}
      <div style={{ marginBottom: 16 }}>
        <StatsCards stats={stats} />
      </div>

      {/* Charts */}
      <div style={{ marginBottom: 16 }}>
        <Charts
          appointmentsByMonth={stats.appointmentsByMonth}
          appointmentsByStatus={stats.appointmentsByStatus}
        />
      </div>

      {/* Recent Activity */}
      <Row gutter={16}>
        <Col xs={24}>
          <RecentActivity activities={stats.recentActivities} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
