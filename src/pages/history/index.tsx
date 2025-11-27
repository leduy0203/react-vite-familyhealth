import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Modal,
  Empty,
  Statistic,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCompletedAppointments } from "../../redux/slice/appointmentSlice";
import type { IAppointment } from "../../types/health";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const MedicalHistoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.appointment);
  const [searchText, setSearchText] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IAppointment | null>(null);

  useEffect(() => {
    dispatch(fetchCompletedAppointments());
  }, [dispatch]);

  // Filter appointments based on search
  const filteredAppointments = list.filter((apt) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      apt.doctor?.fullName?.toLowerCase().includes(search) ||
      apt.member?.fullName?.toLowerCase().includes(search) ||
      apt.medicalResult?.diagnose?.toLowerCase().includes(search) ||
      apt.location?.toLowerCase().includes(search)
    );
  });

  const totalCost = list.reduce((sum, apt) => sum + (apt.medicalResult?.totalMoney || 0), 0);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "0";
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handleViewDetail = (record: IAppointment) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };

  const columns = [
    {
      title: "Ngày khám",
      key: "time",
      width: 130,
      render: (_: any, record: IAppointment) => {
        const aptDate = record.time || record.appointmentDate || "";
        return aptDate ? (
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              {dayjs(aptDate).format("DD/MM/YYYY")}
            </div>
            <div style={{ color: "#8c8c8c", fontSize: 12 }}>
              {dayjs(aptDate).format("HH:mm")}
            </div>
          </div>
        ) : (
          <Text type="secondary">Chưa có</Text>
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
      width: 160,
      render: (_: any, record: IAppointment) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            <UserOutlined style={{ color: "#52c41a", marginRight: 6 }} />
            {record.member?.fullName || record.patientName || "N/A"}
          </div>
          <div style={{ color: "#8c8c8c", fontSize: 12 }}>
            {record.member?.relation || "Chính chủ"}
          </div>
        </div>
      ),
    },
    {
      title: "Bác sĩ",
      key: "doctor",
      width: 170,
      render: (_: any, record: IAppointment) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            {record.doctor?.fullName || "Chưa có"}
          </div>
          <div style={{ color: "#8c8c8c", fontSize: 12 }}>
            {record.doctor?.expertise || ""}
          </div>
        </div>
      ),
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: 170,
      ellipsis: true,
      render: (text: string) => (
        <div>
          <EnvironmentOutlined style={{ color: "#1890ff", marginRight: 6 }} />
          {text || "Chưa có"}
        </div>
      ),
    },
    {
      title: "Chẩn đoán",
      key: "diagnose",
      width: 200,
      ellipsis: true,
      render: (_: any, record: IAppointment) => (
        <div style={{ fontWeight: 500, color: "#cf1322" }}>
          {record.medicalResult?.diagnose || "Chưa có"}
        </div>
      ),
    },
    {
      title: "Chi phí",
      key: "cost",
      align: "right" as const,
      width: 130,
      render: (_: any, record: IAppointment) => {
        const money = record.medicalResult?.totalMoney;
        return money ? (
          <div style={{ 
            color: "#52c41a", 
            fontWeight: 600, 
            fontSize: 14 
          }}>
            {formatCurrency(money)} đ
          </div>
        ) : (
          <div style={{ color: "#8c8c8c" }}>0 đ</div>
        );
      },
      sorter: (a: IAppointment, b: IAppointment) => 
        (a.medicalResult?.totalMoney || 0) - (b.medicalResult?.totalMoney || 0),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      width: 120,
      render: (_: any, record: IAppointment) => (
        <Button
          type="primary"
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
      {/* Breadcrumb */}
      <Card style={{ marginBottom: 16 }} bordered={false}>
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
                  <HistoryOutlined />
                  <span>Lịch sử khám bệnh</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Page Title */}
      <Card style={{ marginBottom: 16 }} bordered={false}>
        <Space align="center" style={{ marginBottom: 16 }}>
          <HistoryOutlined style={{ fontSize: 24, color: "#1890ff" }} />
          <Title level={3} style={{ margin: 0 }}>Lịch sử Khám bệnh</Title>
        </Space>

        {/* Search Bar */}
        <Input
          placeholder="Tìm kiếm theo bác sĩ, bệnh nhân, chẩn đoán, địa điểm..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
          style={{ marginBottom: 16 }}
        />
      </Card>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng lượt khám"
              value={list.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng chi phí"
              value={formatCurrency(totalCost)}
              suffix="đ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Chi phí trung bình"
              value={list.length > 0 ? formatCurrency(totalCost / list.length) : "0"}
              suffix="đ"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card bordered={false}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredAppointments}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} lượt khám`,
          }}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical">
                    <HistoryOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
                    <Text type="secondary">Chưa có lịch sử khám bệnh</Text>
                  </Space>
                }
              />
            ),
          }}
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
            <span>Chi tiết kết quả khám bệnh</span>
          </Space>
        }
      >
        {selectedRecord && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {/* Appointment Info */}
            <Card size="small" title="Thông tin lịch khám">
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
                <Descriptions.Item label="Quan hệ">
                  {selectedRecord.member?.relation || "Chính chủ"}
                </Descriptions.Item>
                <Descriptions.Item label="Bác sĩ">
                  {selectedRecord.doctor?.fullName || "Chưa có"}
                </Descriptions.Item>
                <Descriptions.Item label="Chuyên khoa">
                  {selectedRecord.doctor?.expertise || "Chưa có"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa điểm" span={2}>
                  {selectedRecord.location || "Chưa có"}
                </Descriptions.Item>
                <Descriptions.Item label="Lý do khám" span={2}>
                  {selectedRecord.note || "Không có"}
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
                    <Text strong style={{ color: "#cf1322", fontSize: 15 }}>
                      {selectedRecord.medicalResult.diagnose ||
                        selectedRecord.medicalResult.diagnosis ||
                        "Chưa có"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú của bác sĩ">
                    <div style={{ 
                      padding: 12, 
                      background: "#fff", 
                      borderRadius: 6,
                      whiteSpace: "pre-wrap"
                    }}>
                      {selectedRecord.medicalResult.note ||
                        selectedRecord.medicalResult.notes ||
                        "Không có"}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng chi phí">
                    <Tag color="green" style={{ fontSize: 18, padding: "6px 16px" }}>
                      <DollarOutlined />{" "}
                      {selectedRecord.medicalResult.totalMoney
                        ? formatCurrency(selectedRecord.medicalResult.totalMoney)
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

export default MedicalHistoryPage;
