import React, { useEffect, useState } from "react";
import {
  App,
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
  Timeline,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { api } from "../../config/api";
import type { IMedicalVisit } from "../../types/health";

const { Title, Text, Paragraph } = Typography;

const MedicalHistoryPage: React.FC = () => {
  const { message } = App.useApp();
  const [visits, setVisits] = useState<IMedicalVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await api.getMedicalVisits();
      setVisits(res.data);
    } catch (error) {
      message.error("Không thể tải lịch sử khám bệnh");
      console.error("Error fetching medical visits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter visits based on search
  const filteredVisits = visits.filter((visit) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      visit.doctorName?.toLowerCase().includes(search) ||
      visit.diagnosis?.toLowerCase().includes(search) ||
      visit.hospital?.toLowerCase().includes(search) ||
      visit.doctorSpecialization?.toLowerCase().includes(search)
    );
  });

  const getStatusTag = (status: string) => {
    const statusConfig = {
      completed: { color: "green", text: "Hoàn thành" },
      follow_up_needed: { color: "orange", text: "Cần tái khám" },
      cancelled: { color: "red", text: "Đã hủy" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "default",
      text: status,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = [
    {
      title: "Ngày khám",
      dataIndex: "visitDate",
      key: "visitDate",
      width: 120,
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text strong>{new Date(date).toLocaleDateString("vi-VN")}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(date).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Space>
      ),
    },
    {
      title: "Bác sĩ & Chuyên khoa",
      key: "doctor",
      render: (_: any, record: IMedicalVisit) => (
        <Space direction="vertical" size={0}>
          <Space className="doctor-name">
            <UserOutlined className="icon" />
            <Text strong>{record.doctorName}</Text>
          </Space>
          <Text type="secondary" className="specialization">
            {record.doctorSpecialization}
          </Text>
        </Space>
      ),
    },
    {
      title: "Bệnh viện",
      dataIndex: "hospital",
      key: "hospital",
      ellipsis: true,
      render: (text: string) => (
        <Space className="hospital-cell">
          <EnvironmentOutlined className="icon" />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Chẩn đoán",
      dataIndex: "diagnosis",
      key: "diagnosis",
      ellipsis: true,
      render: (text: string) => (
        <Text strong className="diagnosis">
          {text}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 140,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Chi phí",
      dataIndex: "cost",
      key: "cost",
      align: "right" as const,
      width: 120,
      render: (cost: number) => (
        <Text className="cost">{formatCurrency(cost)}</Text>
      ),
    },
  ];

  const expandedRowRender = (record: IMedicalVisit) => (
    <div className="expanded-content">
      <Row gutter={24}>
        {/* Left Column - Details */}
        <Col xs={24} md={12}>
          <Card className="detail-card" size="small" title="Thông tin chi tiết">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Triệu chứng">
                {record.symptoms && record.symptoms.length > 0 ? (
                  <Space wrap size={4}>
                    {record.symptoms.map((symptom, idx) => (
                      <Tag key={idx} color="blue">
                        {symptom}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Text type="secondary">Không có</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Điều trị">
                <Text>{record.treatment || "N/A"}</Text>
              </Descriptions.Item>
              {record.followUpDate && (
                <Descriptions.Item label="Ngày tái khám">
                  <Space>
                    <CalendarOutlined />
                    <Text>
                      {new Date(record.followUpDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </Text>
                  </Space>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Ghi chú">
                <Paragraph
                  className="notes"
                  ellipsis={{ rows: 2, expandable: true }}
                >
                  {record.notes || "Không có ghi chú"}
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Right Column - Lab Tests & Files */}
        <Col xs={24} md={12}>
          {/* Lab Tests */}
          {record.labTests && record.labTests.length > 0 && (
            <Card
              className="detail-card"
              size="small"
              title={
                <Space>
                  <ExperimentOutlined />
                  <span>Kết quả xét nghiệm</span>
                </Space>
              }
              style={{ marginBottom: 16 }}
            >
              <Timeline
                items={record.labTests.map((test, idx) => ({
                  key: idx,
                  color: test.result ? "green" : "gray",
                  children: (
                    <div>
                      <Text strong>{test.name}</Text>
                      {test.result && (
                        <>
                          <br />
                          <Text type="secondary">{test.result}</Text>
                        </>
                      )}
                    </div>
                  ),
                }))}
              />
            </Card>
          )}

          {/* Attachments */}
          {record.attachments && record.attachments.length > 0 && (
            <Card
              className="detail-card"
              size="small"
              title={
                <Space>
                  <FileTextOutlined />
                  <span>Tài liệu đính kèm</span>
                </Space>
              }
            >
              <Space direction="vertical" className="attachments">
                {record.attachments.map((file) => (
                  <div key={file.id} className="attachment-item">
                    <Space>
                      <FileTextOutlined />
                      <Text>{file.name}</Text>
                    </Space>
                    <Button
                      type="link"
                      size="small"
                      icon={<DownloadOutlined />}
                    >
                      Tải xuống
                    </Button>
                  </div>
                ))}
              </Space>
            </Card>
          )}

          {/* Prescription Link */}
          {record.prescriptionId && (
            <Card className="detail-card" size="small">
              <Space>
                <MedicineBoxOutlined style={{ color: "#52c41a" }} />
                <Text>Có đơn thuốc kèm theo</Text>
                <Button type="link" size="small" icon={<EyeOutlined />}>
                  Xem đơn thuốc
                </Button>
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="history-page">
      {/* Breadcrumb Card */}
      <Card variant="borderless" className="breadcrumb-card">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined className="icon" />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <HistoryOutlined className="icon" />
                  <span>Lịch sử khám bệnh</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Main Content Card */}
      <Card variant="borderless" className="content-card">
        {/* Header */}
        <div className="page-header">
          <Space align="center" className="header-title">
            <HistoryOutlined className="icon" />
            <Title level={5}>Lịch sử Khám bệnh</Title>
          </Space>

          {/* Search Bar */}
          <Input
            className="search-input"
            placeholder="Tìm kiếm theo bác sĩ, chẩn đoán, bệnh viện..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />

          {/* Stats */}
          <Row gutter={16} className="stats-row">
            <Col xs={12} sm={6}>
              <Card className="stat-card" size="small">
                <div className="stat-content">
                  <CalendarOutlined className="stat-icon" />
                  <div>
                    <Text type="secondary">Tổng lượt khám</Text>
                    <Title level={4}>{visits.length}</Title>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="stat-card" size="small">
                <div className="stat-content">
                  <DollarOutlined className="stat-icon green" />
                  <div>
                    <Text type="secondary">Tổng chi phí</Text>
                    <Title level={4}>
                      {formatCurrency(
                        visits.reduce((sum, v) => sum + (v.cost || 0), 0)
                      )}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="stat-card" size="small">
                <div className="stat-content">
                  <MedicineBoxOutlined className="stat-icon blue" />
                  <div>
                    <Text type="secondary">Cần tái khám</Text>
                    <Title level={4}>
                      {
                        visits.filter((v) => v.status === "follow_up_needed")
                          .length
                      }
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="stat-card" size="small">
                <div className="stat-content">
                  <FileTextOutlined className="stat-icon orange" />
                  <div>
                    <Text type="secondary">Có đơn thuốc</Text>
                    <Title level={4}>
                      {visits.filter((v) => v.prescriptionId).length}
                    </Title>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Table
          className="history-table"
          rowKey="id"
          loading={loading}
          dataSource={filteredVisits}
          columns={columns}
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpandedRowsChange: (keys) =>
              setExpandedRowKeys(keys as string[]),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} lượt khám`,
          }}
          locale={{
            emptyText: (
              <div className="empty-state">
                <HistoryOutlined className="icon" />
                <div className="text">Chưa có lịch sử khám bệnh</div>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default MedicalHistoryPage;
