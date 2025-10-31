import React from "react";
import { Card, Descriptions, Tag, Space, Typography, Divider, Button } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { IAppointment } from "../../types/health";
import dayjs from "dayjs";

const { Text, Title } = Typography;

interface AppointmentDetailCardProps {
  appointment: IAppointment;
  onUpdateStatus?: (id: string, status: IAppointment["status"]) => void;
}

const AppointmentDetailCard: React.FC<AppointmentDetailCardProps> = ({
  appointment,
  onUpdateStatus,
}) => {
  const getStatusTag = (status: IAppointment["status"]) => {
    const statusConfig = {
      pending: { color: "warning", text: "Chờ xác nhận" },
      confirmed: { color: "success", text: "Đã xác nhận" },
      completed: { color: "default", text: "Hoàn thành" },
      cancelled: { color: "error", text: "Đã hủy" },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const canConfirm = appointment.status === "pending";
  const canComplete = appointment.status === "confirmed";
  const canCancel = appointment.status === "pending" || appointment.status === "confirmed";

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Basic Info */}
        <div>
          <Title level={5}>
            <CalendarOutlined /> Thông tin lịch hẹn
          </Title>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã lịch hẹn">
              <Text code>{appointment.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Space><UserOutlined />Bệnh nhân</Space>}>
              <Text strong>{appointment.patientName || "N/A"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Space><CalendarOutlined />Ngày giờ hẹn</Space>}>
              <Text strong style={{ color: "#1890ff" }}>
                {dayjs(appointment.appointmentDate).format("DD/MM/YYYY HH:mm")}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Space><EnvironmentOutlined />Địa điểm</Space>}>
              {appointment.location}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(appointment.status)}
            </Descriptions.Item>
            {appointment.createdAt && (
              <Descriptions.Item label={<Space><ClockCircleOutlined />Ngày tạo</Space>}>
                {dayjs(appointment.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>

        {/* Notes */}
        {appointment.note && (
          <div>
            <Title level={5}>
              <FileTextOutlined /> Ghi chú
            </Title>
            <Card size="small" style={{ background: "#fafafa" }}>
              <Text>{appointment.note}</Text>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {onUpdateStatus && (
          <>
            <Divider />
            <div>
              <Title level={5}>Cập nhật trạng thái</Title>
              <Space wrap>
                {canConfirm && (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => onUpdateStatus(appointment.id, "confirmed")}
                  >
                    Xác nhận lịch hẹn
                  </Button>
                )}
                {canComplete && (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    style={{ background: "#52c41a" }}
                    onClick={() => onUpdateStatus(appointment.id, "completed")}
                  >
                    Đánh dấu hoàn thành
                  </Button>
                )}
                {canCancel && (
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                  >
                    Hủy lịch hẹn
                  </Button>
                )}
              </Space>
            </div>
          </>
        )}
      </Space>
    </Card>
  );
};

export default AppointmentDetailCard;
