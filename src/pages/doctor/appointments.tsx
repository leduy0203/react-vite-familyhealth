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
} from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAppointments, updateAppointment } from "../../redux/slice/appointmentSlice";
import AppointmentDetailCard from "../../components/appointments/AppointmentDetailCard";
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

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

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

    try {
      await dispatch(updateAppointment({ ...appointment, status })).unwrap();
      message.success("Cập nhật trạng thái thành công");
      setDetailModalOpen(false);
      dispatch(fetchAppointments());
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const items = list.filter(
      (a) => a.appointmentDate && a.appointmentDate.startsWith(dateStr)
    );

    return (
      <ul className="events" style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 4 }}>
            <Badge
              status={
                item.status === "pending"
                  ? "warning"
                  : item.status === "confirmed"
                  ? "success"
                  : item.status === "completed"
                  ? "default"
                  : "error"
              }
              text={
                <Text
                  ellipsis
                  style={{ fontSize: 11, cursor: "pointer" }}
                  onClick={() => handleViewAppointment(item)}
                >
                  {dayjs(item.appointmentDate).format("HH:mm")} {item.patientName || ""}
                </Text>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // Get appointments for selected date
  const selectedDateStr = selectedDate.format("YYYY-MM-DD");
  const appointmentsOnSelectedDate = list
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
  const completedCount = list.filter((a) => a.status === "COMPLETED" || a.status === "completed").length;

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
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={pendingCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={confirmedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={completedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card variant="borderless">
            <div style={{ marginBottom: 16 }}>
              <Space align="center">
                <CalendarOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Title level={4} style={{ margin: 0 }}>
                  Lịch khám bệnh
                </Title>
              </Space>
            </div>
            <Calendar
              value={selectedDate}
              onSelect={handleDateSelect}
              cellRender={dateCellRender}
            />
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
                            {dayjs(item.appointmentDate).format("HH:mm")}
                          </Text>
                        </div>
                      }
                      title={
                        <Space>
                          <UserOutlined />
                          <Text strong>{item.patientName}</Text>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Space size="small">
                            <EnvironmentOutlined style={{ fontSize: 12 }} />
                            <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                              {item.location}
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
    </div>
  );
};

export default DoctorAppointments;
