import React, { useEffect, useState } from "react";
import {
  Card,
  Calendar,
  Badge,
  Space,
  Typography,
  Breadcrumb,
  Modal,
  List,
  Tag,
  App,
  Row,
  Col,
  Statistic,
  Segmented,
} from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchDoctorAppointments, changeAppointmentStatus } from "../../redux/slice/appointmentSlice";
import AppointmentDetailCard from "../../components/appointments/AppointmentDetailCard";
import MedicalResultModal from "../../components/appointments/MedicalResultModal";
import type { IAppointment } from "../../types/health";
import dayjs, { type Dayjs } from "dayjs";

const { Title, Text } = Typography;

const DoctorAppointments: React.FC = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((s) => s.appointment);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<'SCHEDULED' | 'CONFIRMED' | 'all'>('SCHEDULED');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [medicalResultModalOpen, setMedicalResultModalOpen] = useState(false);

  useEffect(() => {
    // Load appointments based on filter
    const statusParam = filterStatus === 'all' ? undefined : filterStatus;
    dispatch(fetchDoctorAppointments(statusParam));
  }, [dispatch, filterStatus]);

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleViewAppointment = (appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    setDetailModalOpen(true);
  };

  const handleUpdateStatus = async (id: string | number, status: IAppointment["status"]) => {
    const appointment = list.find((a) => a.id === id);
    if (!appointment) return;

    // If completing appointment, open medical result modal first
    if (status === "COMPLETED") {
      setSelectedAppointment(appointment);
      setMedicalResultModalOpen(true);
      return;
    }

    // Normalize status to uppercase
    const normalizedStatus = status.toUpperCase() as "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

    try {
      await dispatch(changeAppointmentStatus({ id: Number(id), status: normalizedStatus })).unwrap();
      message.success("Cập nhật trạng thái thành công");
      setDetailModalOpen(false);
      // Reload appointments based on current filter
      const statusParam = filterStatus === 'all' ? undefined : filterStatus;
      dispatch(fetchDoctorAppointments(statusParam));
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const handleSubmitMedicalResult = async () => {
    if (!selectedAppointment) return;

    try {
      // Medical result is already saved in the modal, now just update status to COMPLETED
      await dispatch(
        changeAppointmentStatus({
          id: Number(selectedAppointment.id),
          status: "COMPLETED",
        })
      ).unwrap();
      setMedicalResultModalOpen(false);
      setDetailModalOpen(false);
      // Reload appointments based on current filter
      const statusParam = filterStatus === 'all' ? undefined : filterStatus;
      dispatch(fetchDoctorAppointments(statusParam));
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
      throw err;
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const items = filteredAppointments.filter((a) => {
      const aptDate = a.time || a.appointmentDate || "";
      return aptDate.startsWith(dateStr);
    });

    return (
      <ul className="events" style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => {
          const aptTime = item.time || item.appointmentDate || "";
          const patientName = item.member?.fullName || item.patientName || "";
          return (
            <li key={item.id} style={{ marginBottom: 4 }}>
              <Badge
                status={
                  item.status === "SCHEDULED" || item.status === "pending"
                    ? "warning"
                    : item.status === "CONFIRMED" || item.status === "confirmed"
                    ? "success"
                    : item.status === "COMPLETED" || item.status === "completed"
                    ? "default"
                    : "error"
                }
                text={
                  <Text
                    ellipsis
                    style={{ fontSize: 11, cursor: "pointer" }}
                    onClick={() => handleViewAppointment(item)}
                  >
                    {aptTime ? dayjs(aptTime).format("HH:mm") : "N/A"} {patientName}
                  </Text>
                }
              />
            </li>
          );
        })}
      </ul>
    );
  };

  // Filter appointments by status
  const filteredAppointments = list.filter((a) => {
    if (filterStatus === 'all') return true;
    // Support both new and legacy status values
    const normalizedStatus = a.status.toUpperCase();
    return normalizedStatus === filterStatus || 
           (filterStatus === 'SCHEDULED' && normalizedStatus === 'PENDING') ||
           (filterStatus === 'CONFIRMED' && normalizedStatus === 'CONFIRMED');
  });

  // Get appointments for selected date
  const selectedDateStr = selectedDate.format("YYYY-MM-DD");
  const appointmentsOnSelectedDate = filteredAppointments
    .filter((a) => {
      const aptDate = a.time || a.appointmentDate || "";
      return aptDate.startsWith(selectedDateStr);
    })
    .sort((a, b) => {
      const dateA = a.time || a.appointmentDate || "";
      const dateB = b.time || b.appointmentDate || "";
      return dateA > dateB ? 1 : -1;
    });

  // Statistics
  const pendingCount = list.filter((a) => a.status === "SCHEDULED" || a.status === "pending").length;
  const confirmedCount = list.filter((a) => a.status === "CONFIRMED" || a.status === "confirmed").length;

  const getStatusTag = (status: IAppointment["status"]) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      SCHEDULED: { color: "warning", text: "Chờ xác nhận" },
      CONFIRMED: { color: "success", text: "Đã xác nhận" },
      COMPLETED: { color: "default", text: "Hoàn thành" },
      CANCELLED: { color: "error", text: "Đã hủy" },
      pending: { color: "warning", text: "Chờ xác nhận" },
      confirmed: { color: "success", text: "Đã xác nhận" },
      completed: { color: "default", text: "Hoàn thành" },
      cancelled: { color: "error", text: "Đã hủy" },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <div className="doctor-appointments-page">
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
                  <CalendarOutlined />
                  <span>Lịch khám bệnh</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            onClick={() => setFilterStatus('SCHEDULED')}
            style={{
              cursor: 'pointer',
              borderColor: filterStatus === 'SCHEDULED' ? '#faad14' : undefined,
              borderWidth: filterStatus === 'SCHEDULED' ? 2 : 1,
            }}
          >
            <Statistic
              title="Chờ xác nhận"
              value={pendingCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            onClick={() => setFilterStatus('CONFIRMED')}
            style={{
              cursor: 'pointer',
              borderColor: filterStatus === 'CONFIRMED' ? '#52c41a' : undefined,
              borderWidth: filterStatus === 'CONFIRMED' ? 2 : 1,
            }}
          >
            <Statistic
              title="Đã xác nhận"
              value={confirmedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            onClick={() => setFilterStatus('all')}
            style={{
              cursor: 'pointer',
              borderColor: filterStatus === 'all' ? '#1890ff' : undefined,
              borderWidth: filterStatus === 'all' ? 2 : 1,
            }}
          >
            <Statistic
              title="Tất cả"
              value={list.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card variant="borderless">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space align="center">
                <CalendarOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Title level={4} style={{ margin: 0 }}>
                  Lịch khám bệnh
                </Title>
              </Space>
              <Segmented
                value={viewMode}
                onChange={(value) => setViewMode(value as 'calendar' | 'list')}
                options={[
                  { label: 'Lịch', value: 'calendar', icon: <CalendarOutlined /> },
                  { label: 'Danh sách', value: 'list', icon: <UnorderedListOutlined /> },
                ]}
              />
            </div>

            {viewMode === 'calendar' ? (
              <Calendar
                value={selectedDate}
                onSelect={handleDateSelect}
                cellRender={dateCellRender}
              />
            ) : (
              <List
                dataSource={filteredAppointments}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: "pointer", padding: "16px 0" }}
                    onClick={() => handleViewAppointment(item)}
                    actions={[
                      <Space key="actions" size="small">
                        {(item.status === 'SCHEDULED' || item.status === 'pending') && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(item.id, 'CONFIRMED');
                              }}
                              style={{
                                padding: '6px 20px',
                                border: 'none',
                                borderRadius: 6,
                                background: '#52c41a',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 500,
                                transition: 'all 0.3s',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#73d13d'}
                              onMouseOut={(e) => e.currentTarget.style.background = '#52c41a'}
                            >
                              ✅ Xác nhận
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(item.id, 'CANCELLED');
                              }}
                              style={{
                                padding: '6px 20px',
                                border: '1px solid #ff4d4f',
                                borderRadius: 6,
                                background: 'white',
                                color: '#ff4d4f',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 500,
                                transition: 'all 0.3s',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#ff4d4f';
                                e.currentTarget.style.color = 'white';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#ff4d4f';
                              }}
                            >
                              ❌ Hủy
                            </button>
                          </>
                        )}
                        {(item.status === 'CONFIRMED' || item.status === 'confirmed') && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(item.id, 'COMPLETED');
                              }}
                              style={{
                                padding: '6px 20px',
                                border: 'none',
                                borderRadius: 6,
                                background: '#1890ff',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 500,
                                transition: 'all 0.3s',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#40a9ff'}
                              onMouseOut={(e) => e.currentTarget.style.background = '#1890ff'}
                            >
                              ✔️ Hoàn thành
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(item.id, 'CANCELLED');
                              }}
                              style={{
                                padding: '6px 20px',
                                border: '1px solid #ff4d4f',
                                borderRadius: 6,
                                background: 'white',
                                color: '#ff4d4f',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 500,
                                transition: 'all 0.3s',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#ff4d4f';
                                e.currentTarget.style.color = 'white';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#ff4d4f';
                              }}
                            >
                              ❌ Hủy
                            </button>
                          </>
                        )}
                      </Space>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 8,
                            background: "#f0f5ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                            {item.time ? dayjs(item.time).format("HH:mm") : "N/A"}
                          </Text>
                        </div>
                      }
                      title={
                        <Space>
                          <CalendarOutlined />
                          <Text strong>
                            {item.time ? dayjs(item.time).format("DD/MM/YYYY") : "Chưa có"}
                          </Text>
                          <UserOutlined />
                          <Text strong>{item.member?.fullName || item.patientName || "N/A"}</Text>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Space size="small">
                            <EnvironmentOutlined style={{ fontSize: 12 }} />
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {item.location || 'Chưa có địa điểm'}
                            </Text>
                          </Space>
                          {item.note && (
                            <Text type="secondary" ellipsis style={{ fontSize: 13 }}>
                              📝 {item.note}
                            </Text>
                          )}
                          <div style={{ marginTop: 4 }}>{getStatusTag(item.status)}</div>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card variant="borderless">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>
                <ClockCircleOutlined /> Lịch hẹn ngày{" "}
                {selectedDate.format("DD/MM/YYYY")}
              </Title>
            </div>

            {appointmentsOnSelectedDate.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <CalendarOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                <Text type="secondary" style={{ display: "block", marginTop: 16 }}>
                  Không có lịch hẹn
                </Text>
              </div>
            ) : (
              <List
                dataSource={appointmentsOnSelectedDate}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: "pointer", padding: "12px 0" }}
                    onClick={() => handleViewAppointment(item)}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 8,
                            background: "#f0f5ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                            {item.time ? dayjs(item.time).format("HH:mm") : "N/A"}
                          </Text>
                        </div>
                      }
                      title={
                        <Space>
                          <UserOutlined />
                          <Text strong>{item.member?.fullName || item.patientName || "N/A"}</Text>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Space size="small">
                            <EnvironmentOutlined style={{ fontSize: 12 }} />
                            <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                              {item.location || "Chưa có địa điểm"}
                            </Text>
                          </Space>
                          <div style={{ marginTop: 4 }}>{getStatusTag(item.status)}</div>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={700}
        title={
          <Space>
            <CalendarOutlined />
            <span>Chi tiết lịch hẹn</span>
          </Space>
        }
      >
        {selectedAppointment && (
          <AppointmentDetailCard
            appointment={selectedAppointment}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </Modal>

      {/* Medical Result Modal */}
      <MedicalResultModal
        open={medicalResultModalOpen}
        appointment={selectedAppointment}
        onCancel={() => setMedicalResultModalOpen(false)}
        onSubmit={handleSubmitMedicalResult}
      />
    </div>
  );
};

export default DoctorAppointments;
