import React, { useState } from "react";
import { Table, Card, Tag, Space, Select, DatePicker, Row, Col, Button, Statistic } from "antd";
import { FileTextOutlined, UserOutlined, DollarOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

// Fake data: tất cả lịch sử khám của bác sĩ (tất cả bệnh nhân)
const mockAllHistory = [
  {
    id: 1,
    appointment_date: "2025-11-01 09:00",
    patient_name: "Nguyễn Văn A",
    patient_id: 1,
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "COMPLETED",
    diagnose: "Cảm cúm, viêm họng nhẹ",
    note: "Khám lần đầu, kê thuốc hạ sốt và kháng sinh",
    total_money: 200000,
  },
  {
    id: 2,
    appointment_date: "2025-11-01 14:00",
    patient_name: "Trần Thị B",
    patient_id: 2,
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "COMPLETED",
    diagnose: "Cao huyết áp",
    note: "Tái khám định kỳ, điều chỉnh liều thuốc",
    total_money: 300000,
  },
  {
    id: 3,
    appointment_date: "2025-11-05 10:00",
    patient_name: "Lê Minh C",
    patient_id: 3,
    location: "Phòng khám Hô hấp - Tầng 3",
    status: "COMPLETED",
    diagnose: "Viêm phế quản",
    note: "Khám lần đầu, kê thuốc giãn phế quản",
    total_money: 250000,
  },
  {
    id: 4,
    appointment_date: "2025-11-10 09:30",
    patient_name: "Phạm Thị D",
    patient_id: 4,
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "COMPLETED",
    diagnose: "Đau dạ dày",
    note: "Khám tổng quát, kê thuốc giảm đau và bảo vệ niêm mạc dạ dày",
    total_money: 180000,
  },
  {
    id: 5,
    appointment_date: "2025-11-15 11:00",
    patient_name: "Nguyễn Văn A",
    patient_id: 1,
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "COMPLETED",
    diagnose: "Viêm họng mạn tính",
    note: "Tái khám, kê thêm kháng sinh và thuốc xịt họng",
    total_money: 350000,
  },
  {
    id: 6,
    appointment_date: "2025-11-20 15:00",
    patient_name: "Trần Thị B",
    patient_id: 2,
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "SCHEDULED",
    diagnose: "",
    note: "Lịch hẹn tái khám",
    total_money: 0,
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  SCHEDULED: { text: "Đã đặt", color: "blue" },
  COMPLETED: { text: "Hoàn thành", color: "green" },
  CANCELLED: { text: "Đã hủy", color: "red" },
};

const DoctorMedicalHistory: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const filteredData = mockAllHistory.filter((item) => {
    const matchStatus = !statusFilter || item.status === statusFilter;
    const matchDate =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (dayjs(item.appointment_date).isAfter(dateRange[0]) && dayjs(item.appointment_date).isBefore(dateRange[1]));
    return matchStatus && matchDate;
  });

  const totalCompleted = mockAllHistory.filter((i) => i.status === "COMPLETED").length;
  const totalRevenue = mockAllHistory.filter((i) => i.status === "COMPLETED").reduce((sum, i) => sum + i.total_money, 0);

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "appointment_date",
      key: "appointment_date",
      render: (text: string) => (
        <Space>
          <CalendarOutlined style={{ color: "#1890ff" }} />
          {text}
        </Space>
      ),
      sorter: (a: any, b: any) => dayjs(a.appointment_date).unix() - dayjs(b.appointment_date).unix(),
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient_name",
      key: "patient_name",
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "#52c41a" }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    { title: "Địa điểm", dataIndex: "location", key: "location", ellipsis: true },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s: string) => <Tag color={statusMap[s].color}>{statusMap[s].text}</Tag>,
      filters: [
        { text: "Đã đặt", value: "SCHEDULED" },
        { text: "Hoàn thành", value: "COMPLETED" },
        { text: "Đã hủy", value: "CANCELLED" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    { title: "Chẩn đoán", dataIndex: "diagnose", key: "diagnose", ellipsis: true },
    {
      title: "Tổng tiền",
      dataIndex: "total_money",
      key: "total_money",
      render: (v: number) =>
        v > 0 ? (
          <Tag color="green">
            <DollarOutlined /> {v.toLocaleString()} đ
          </Tag>
        ) : (
          <Tag>Chưa thanh toán</Tag>
        ),
      sorter: (a: any, b: any) => a.total_money - b.total_money,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: any) => (
        <Button type="link" size="small" onClick={() => alert(`Xem chi tiết lịch khám #${record.id}`)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng lịch khám" value={mockAllHistory.length} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Đã hoàn thành" value={totalCompleted} valueStyle={{ color: "#3f8600" }} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              valueStyle={{ color: "#cf1322" }}
              prefix={<DollarOutlined />}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu TB/lần"
              value={totalCompleted > 0 ? totalRevenue / totalCompleted : 0}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="đ"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space style={{ fontSize: 20, fontWeight: 600 }}>
            <FileTextOutlined style={{ color: "#1890ff" }} />
            Lịch sử khám bệnh tổng hợp
          </Space>
        }
        extra={<Tag color="blue">{filteredData.length} bản ghi</Tag>}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              <Select.Option value="SCHEDULED">Đã đặt</Select.Option>
              <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
              <Select.Option value="CANCELLED">Đã hủy</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
              format="DD/MM/YYYY"
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
            />
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          bordered
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} bản ghi` }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default DoctorMedicalHistory;
