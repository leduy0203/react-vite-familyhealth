import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    newAppointmentsToday: number;
    newRecordsToday: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Tổng người dùng"
            value={stats.totalUsers}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Bác sĩ"
            value={stats.totalDoctors}
            prefix={<MedicineBoxOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Bệnh nhân"
            value={stats.totalPatients}
            prefix={<TeamOutlined />}
            valueStyle={{ color: "#eb2f96" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Tổng lịch hẹn"
            value={stats.totalAppointments}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Lịch hẹn hôm nay"
            value={stats.newAppointmentsToday}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic
            title="Hồ sơ mới hôm nay"
            value={stats.newRecordsToday}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#13c2c2" }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;
