import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Space,
  Typography,
  Breadcrumb,
  Tag,
  App,
  Row,
  Col,
  Statistic,
  Avatar,
  Button,
  Empty,
} from "antd";
import {
  HomeOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  FileTextOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAppointments, updateAppointment } from "../../redux/slice/appointmentSlice";
import MedicalResultModal from "../../components/appointments/MedicalResultModal";
import type { IAppointment } from "../../types/health";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ConfirmedAppointments: React.FC = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((s) => s.appointment);
  const [medicalResultModalOpen, setMedicalResultModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Filter only CONFIRMED appointments
  const confirmedAppointments = list
    .filter((a) => a.status === "CONFIRMED" || a.status === "confirmed")
    .sort((a, b) => {
      const dateA = a.time || a.appointmentDate || "";
      const dateB = b.time || b.appointmentDate || "";
      return dateA > dateB ? 1 : -1;
    });

  const todayAppointments = confirmedAppointments.filter((a) => {
    const aptDate = a.time || a.appointmentDate || "";
    return aptDate.startsWith(dayjs().format("YYYY-MM-DD"));
  });

  const upcomingAppointments = confirmedAppointments.filter((a) => {
    const aptDate = a.time || a.appointmentDate || "";
    return aptDate > dayjs().format("YYYY-MM-DD");
  });

  const handleOpenMedicalResult = (appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    setMedicalResultModalOpen(true);
  };

  const handleSubmitMedicalResult = async (
    appointmentId: string | number,
    result: IAppointment["medicalResult"]
  ) => {
    const appointment = list.find((a) => a.id === appointmentId);
    if (!appointment) return;

    try {
      await dispatch(
        updateAppointment({
          ...appointment,
          status: "COMPLETED",
          medicalResult: result,
        })
      ).unwrap();
      message.success("Lưu kết quả khám thành công");
      setMedicalResultModalOpen(false);
      dispatch(fetchAppointments());
    } catch (err) {
      throw err;
    }
  };

  const handleCancelAppointment = async (appointment: IAppointment) => {
    try {
      await dispatch(
        updateAppointment({
          ...appointment,
          status: "CANCELLED",
        })
      ).unwrap();
      message.success("Đã hủy lịch hẹn");
      dispatch(fetchAppointments());
    } catch (err) {
      message.error("Hủy lịch thất bại");
    }
  };

  const renderAppointmentCard = (apt: IAppointment) => {
    const aptDate = apt.time || apt.appointmentDate || "";
    const isToday = aptDate.startsWith(dayjs().format("YYYY-MM-DD"));

    return (
      <Card
        hoverable
        style={{
          marginBottom: 16,
          borderLeft: isToday ? "4px solid #52c41a" : "4px solid #1890ff",
        }}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              {/* Patient Info */}
              <div>
                <Space>
                  <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {apt.patientName}
                    </Title>
                    <Text type="secondary">
                      {apt.member?.relation || "Bệnh nhân"} | BHYT: {apt.member?.bhyt || "Không có"}
                    </Text>
                  </div>
                </Space>
              </div>

              {/* Appointment Details */}
              <Space wrap>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {dayjs(aptDate).format("DD/MM/YYYY HH:mm")}
                </Tag>
                <Tag icon={<MedicineBoxOutlined />}>{apt.location}</Tag>
                {isToday && (
                  <Tag color="success" style={{ fontWeight: "bold" }}>
                    🔥 Hôm nay
                  </Tag>
                )}
              </Space>

              {/* Patient Note */}
              {apt.note && (
                <div
                  style={{
                    padding: 12,
                    background: "#f0f5ff",
                    borderRadius: 6,
                    borderLeft: "3px solid #1890ff",
                  }}
                >
                  <Space direction="vertical" size={4}>
                    <Text strong style={{ color: "#1890ff" }}>
                      <FileTextOutlined /> Lý do khám:
                    </Text>
                    <Text>{apt.note}</Text>
                  </Space>
                </div>
              )}

              {/* Medical Result Preview */}
              {apt.medicalResult && (
                <div
                  style={{
                    padding: 12,
                    background: "#f6ffed",
                    borderRadius: 6,
                    borderLeft: "3px solid #52c41a",
                  }}
                >
                  <Space direction="vertical" size={4}>
                    <Text strong style={{ color: "#52c41a" }}>
                      ✅ Đã có kết quả khám
                    </Text>
                    <Text type="secondary">Chẩn đoán: {apt.medicalResult.diagnosis}</Text>
                  </Space>
                </div>
              )}
            </Space>
          </Col>

          <Col span={8} style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <Button
              type="primary"
              size="large"
              icon={<FormOutlined />}
              onClick={() => handleOpenMedicalResult(apt)}
              block
            >
              {apt.medicalResult ? "Xem/Sửa kết quả" : "Nhập kết quả khám"}
            </Button>
            <Button
              danger
              onClick={() => handleCancelAppointment(apt)}
              block
            >
              Hủy lịch hẹn
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="doctor-confirmed-appointments-page">
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
                  <MedicineBoxOutlined />
                  <span>Lịch khám đã xác nhận</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Lịch hôm nay"
              value={todayAppointments.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix="bệnh nhân"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Lịch sắp tới"
              value={upcomingAppointments.length}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: "#1890ff" }}
              suffix="bệnh nhân"
            />
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <Card
          variant="borderless"
          style={{ marginBottom: 24 }}
          title={
            <Space>
              <ClockCircleOutlined style={{ color: "#52c41a" }} />
              <span>Lịch khám hôm nay ({todayAppointments.length})</span>
            </Space>
          }
        >
          {todayAppointments.map((apt) => renderAppointmentCard(apt))}
        </Card>
      )}

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card
          variant="borderless"
          title={
            <Space>
              <MedicineBoxOutlined style={{ color: "#1890ff" }} />
              <span>Lịch khám sắp tới ({upcomingAppointments.length})</span>
            </Space>
          }
        >
          {upcomingAppointments.map((apt) => renderAppointmentCard(apt))}
        </Card>
      )}

      {/* Empty State */}
      {confirmedAppointments.length === 0 && (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical">
                <Text type="secondary">Không có lịch khám đã xác nhận</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Hãy xác nhận lịch hẹn từ trang "Lịch khám bệnh"
                </Text>
              </Space>
            }
          />
        </Card>
      )}

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

export default ConfirmedAppointments;
