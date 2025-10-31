import React from "react";
import { Card, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartsProps {
  appointmentsByMonth: { month: string; count: number }[];
  appointmentsByStatus: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

const COLORS = ["#faad14", "#52c41a", "#1890ff", "#f5222d"];

const Charts: React.FC<ChartsProps> = ({ appointmentsByMonth, appointmentsByStatus }) => {
  const statusData = [
    { name: "Chờ xác nhận", value: appointmentsByStatus.pending },
    { name: "Đã xác nhận", value: appointmentsByStatus.confirmed },
    { name: "Hoàn thành", value: appointmentsByStatus.completed },
    { name: "Đã hủy", value: appointmentsByStatus.cancelled },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card title="Lịch hẹn theo tháng">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Số lượng" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card title="Trạng thái lịch hẹn">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default Charts;
