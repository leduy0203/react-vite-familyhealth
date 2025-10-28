import React, { useEffect, useState } from "react";
import {
  Calendar,
  Badge,
  Card,
  List,
  Segmented,
  Row,
  Col,
  Typography,
  Empty,
  Space,
  App,
  Breadcrumb,
} from "antd";
import {
  CalendarOutlined,
  UnorderedListOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchAppointments,
  updateAppointment,
} from "../../redux/slice/appointmentSlice";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import { getStatusConfig } from "../../components/appointments/appointment.utils";
import type { IAppointment } from "../../types/health";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Title, Text } = Typography;

dayjs.locale("vi");

const AppointmentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.appointment);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const { message } = App.useApp();

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Xác nhận lịch hẹn
  const handleConfirm = async (apt: IAppointment) => {
    try {
      await dispatch(
        updateAppointment({ ...apt, status: "confirmed" })
      ).unwrap();
      message.success("Đã xác nhận lịch hẹn thành công!");
    } catch (error) {
      message.error("Xác nhận thất bại, vui lòng thử lại!");
    }
  };

  // Hủy lịch hẹn
  const handleCancel = async (apt: IAppointment) => {
    try {
      await dispatch(
        updateAppointment({ ...apt, status: "cancelled" })
      ).unwrap();
      message.success("Đã hủy lịch hẹn!");
    } catch (error) {
      message.error("Hủy lịch thất bại, vui lòng thử lại!");
    }
  };

  // Lấy các lịch hẹn theo ngày
  const getAppointmentsForDate = (date: Dayjs) => {
    return list.filter((apt) => dayjs(apt.appointmentDate).isSame(date, "day"));
  };

  // Render cell trong calendar
  const dateCellRender = (date: Dayjs) => {
    const appointments = getAppointmentsForDate(date);
    if (appointments.length === 0) return null;

    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {appointments.slice(0, 2).map((apt) => {
          const config = getStatusConfig(apt.status);
          return (
            <li key={apt.id} style={{ marginBottom: 2 }}>
              <Badge color={config.color} text="" />
              <Text
                ellipsis
                style={{ fontSize: 12, marginLeft: 4, maxWidth: 100 }}
              >
                {dayjs(apt.appointmentDate).format("HH:mm")} -{" "}
                {apt.doctorName || "Bác sĩ"}
              </Text>
            </li>
          );
        })}
        {appointments.length > 2 && (
          <li style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
            +{appointments.length - 2} lịch khác
          </li>
        )}
      </ul>
    );
  };

  // Lấy lịch hẹn của ngày được chọn
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div>
      {/* Breadcrumb Card */}
      <Card
        variant="borderless"
        style={{
          marginBottom: 16,
          borderRadius: "8px",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        }}
        styles={{ body: { padding: "12px 24px" } }}
      >
        <Breadcrumb
          style={{ fontSize: "18px" }}
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined style={{ fontSize: "16px" }} />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <CalendarOutlined style={{ fontSize: "16px" }} />
                  <span>Lịch hẹn khám</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Row gutter={16}>
          <Col xs={24}>
            <Card
              title={
                <Space align="center">
                  <CalendarOutlined
                    style={{ fontSize: "20px", color: "#1890ff" }}
                  />
                  <Title level={5} style={{ margin: 0 }}>
                    Lịch hẹn khám
                  </Title>
                </Space>
              }
              extra={
                <Segmented
                  value={viewMode}
                  onChange={(v) => setViewMode(v as "calendar" | "list")}
                  options={[
                    {
                      label: "Lịch",
                      value: "calendar",
                      icon: <CalendarOutlined />,
                    },
                    {
                      label: "Danh sách",
                      value: "list",
                      icon: <UnorderedListOutlined />,
                    },
                  ]}
                />
              }
            >
              <Calendar
                cellRender={dateCellRender}
                onSelect={(date) => setSelectedDate(date)}
                value={selectedDate}
                fullscreen={false}
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  <span>Lịch hẹn ngày {selectedDate.format("DD/MM/YYYY")}</span>
                </Space>
              }
              extra={
                <Badge
                  count={selectedDateAppointments.length}
                  showZero
                  color="#1890ff"
                />
              }
              style={{ marginTop: 16 }}
            >
              {selectedDateAppointments.length === 0 ? (
                <Empty
                  description="Không có lịch hẹn"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  dataSource={selectedDateAppointments}
                  renderItem={(apt) => (
                    <List.Item style={{ padding: "12px 0" }}>
                      <AppointmentCard
                        appointment={apt}
                        variant="calendar"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card
          title={
            <Space align="center">
              <CalendarOutlined
                style={{ fontSize: "20px", color: "#1890ff" }}
              />
              <Title level={5} style={{ margin: 0 }}>
                Lịch hẹn khám
              </Title>
            </Space>
          }
          extra={
            <Segmented
              value={viewMode}
              onChange={(v) => setViewMode(v as "calendar" | "list")}
              options={[
                {
                  label: "Lịch",
                  value: "calendar",
                  icon: <CalendarOutlined />,
                },
                {
                  label: "Danh sách",
                  value: "list",
                  icon: <UnorderedListOutlined />,
                },
              ]}
            />
          }
        >
          <List
            loading={loading}
            dataSource={list}
            locale={{ emptyText: "Không có lịch hẹn nào" }}
            renderItem={(apt) => (
              <List.Item>
                <AppointmentCard
                  appointment={apt}
                  variant="list"
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default AppointmentsPage;
