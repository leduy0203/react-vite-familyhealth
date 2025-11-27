import React, { useState, useEffect } from "react";
import { Table, Card, Tag, Space, Select, DatePicker, Row, Col, Button, Statistic, Modal, Descriptions } from "antd";
import { FileTextOutlined, UserOutlined, DollarOutlined, CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchDoctorAppointments } from "../../redux/slice/appointmentSlice";
import type { IAppointment } from "../../types/health";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const statusMap: Record<string, { text: string; color: string }> = {
  SCHEDULED: { text: "Chờ xác nhận", color: "blue" },
  CONFIRMED: { text: "Đã xác nhận", color: "orange" },
  COMPLETED: { text: "Hoàn thành", color: "green" },
  CANCELLED: { text: "Đã hủy", color: "red" },
};

const DoctorMedicalHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.appointment);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IAppointment | null>(null);

  useEffect(() => {
    // Load COMPLETED appointments
    dispatch(fetchDoctorAppointments("COMPLETED"));
  }, [dispatch]);

  // Filter appointments by status and date range
  const filteredData = list.filter((item) => {
    const matchStatus = !statusFilter || item.status === statusFilter;
    const aptDate = item.time || item.appointmentDate || "";
    const matchDate =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (aptDate && dayjs(aptDate).isAfter(dateRange[0]) && dayjs(aptDate).isBefore(dateRange[1]));
    return matchStatus && matchDate;
  });

  const totalCompleted = list.filter((i) => i.status === "COMPLETED").length;
  const totalRevenue = list
    .filter((i) => i.status === "COMPLETED")
    .reduce((sum, i) => sum + (i.medicalResult?.totalMoney || 0), 0);

  const handleViewDetail = (record: IAppointment) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "time",
      key: "time",
      render: (_: any, record: IAppointment) => {
        const aptDate = record.time || record.appointmentDate || "";
        return aptDate ? (
          <Space>
            <CalendarOutlined style={{ color: "#1890ff" }} />
            <span>{dayjs(aptDate).format("DD/MM/YYYY HH:mm")}</span>
          </Space>
        ) : (
          <span>Chưa có</span>
        );
      },
      sorter: (a: IAppointment, b: IAppointment) => {
        const dateA = a.time || a.appointmentDate || "";
        const dateB = b.time || b.appointmentDate || "";
        return dayjs(dateA).unix() - dayjs(dateB).unix();
      },
    },
    {
      title: "Bệnh nhân",
      key: "patient",
      render: (_: any, record: IAppointment) => (
        <Space>
          <UserOutlined style={{ color: "#52c41a" }} />
          <strong>{record.member?.fullName || record.patientName || "N/A"}</strong>
        </Space>
      ),
    },
    { 
      title: "Địa điểm", 
      dataIndex: "location", 
      key: "location", 
      ellipsis: true,
      render: (text: string) => text || "Chưa có"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s: string) => {
        const config = statusMap[s] || { color: "default", text: s };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: "Chờ xác nhận", value: "SCHEDULED" },
        { text: "Đã xác nhận", value: "CONFIRMED" },
        { text: "Hoàn thành", value: "COMPLETED" },
        { text: "Đã hủy", value: "CANCELLED" },
      ],
      onFilter: (value: any, record: IAppointment) => record.status === value,
    },
    { 
      title: "Chẩn đoán", 
      key: "diagnose",
      ellipsis: true,
      render: (_: any, record: IAppointment) => (
        <span>{record.medicalResult?.diagnose || record.medicalResult?.diagnosis || "Chưa có"}</span>
      )
    },
    {
      title: "Tổng tiền",
      key: "total_money",
      render: (_: any, record: IAppointment) => {
        const money = record.medicalResult?.totalMoney;
        return money && money > 0 ? (
          <Tag color="green">
            <DollarOutlined /> {money.toLocaleString()} đ
          </Tag>
        ) : (
          <Tag>Chưa có</Tag>
        );
      },
      sorter: (a: IAppointment, b: IAppointment) => 
        (a.medicalResult?.totalMoney || 0) - (b.medicalResult?.totalMoney || 0),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 120,
      render: (_: any, record: IAppointment) => (
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng lịch khám" value={list.length} prefix={<FileTextOutlined />} />
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
              <Select.Option value="SCHEDULED">Chờ xác nhận</Select.Option>
              <Select.Option value="CONFIRMED">Đã xác nhận</Select.Option>
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
          loading={loading}
          bordered
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} bản ghi` }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={700}
        title={
          <Space>
            <FileTextOutlined style={{ color: "#1890ff" }} />
            <span>Chi tiết lịch khám</span>
          </Space>
        }
      >
        {selectedRecord && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {/* Appointment Info */}
            <Card size="small" title="Thông tin lịch hẹn">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Ngày khám" span={2}>
                  <Space>
                    <CalendarOutlined />
                    {selectedRecord.time
                      ? dayjs(selectedRecord.time).format("DD/MM/YYYY HH:mm")
                      : "Chưa có"}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Bệnh nhân">
                  {selectedRecord.member?.fullName || selectedRecord.patientName || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Số BHYT">
                  {selectedRecord.member?.bhyt || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa điểm" span={2}>
                  {selectedRecord.location || "Chưa có"}
                </Descriptions.Item>
                <Descriptions.Item label="Lý do khám" span={2}>
                  {selectedRecord.note || "Không có"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {statusMap[selectedRecord.status] ? (
                    <Tag color={statusMap[selectedRecord.status].color}>
                      {statusMap[selectedRecord.status].text}
                    </Tag>
                  ) : (
                    <Tag>{selectedRecord.status}</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Medical Result */}
            {selectedRecord.medicalResult && (
              <Card 
                size="small" 
                title="Kết quả khám bệnh"
                style={{ background: "#f0f5ff" }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Chẩn đoán">
                    <strong>
                      {selectedRecord.medicalResult.diagnose || 
                       selectedRecord.medicalResult.diagnosis || 
                       "Chưa có"}
                    </strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú của bác sĩ">
                    {selectedRecord.medicalResult.note || 
                     selectedRecord.medicalResult.notes || 
                     "Không có"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng chi phí">
                    <Tag color="green" style={{ fontSize: 16, padding: "4px 12px" }}>
                      <DollarOutlined />{" "}
                      {selectedRecord.medicalResult.totalMoney
                        ? selectedRecord.medicalResult.totalMoney.toLocaleString()
                        : "0"}{" "}
                      đ
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default DoctorMedicalHistory;
