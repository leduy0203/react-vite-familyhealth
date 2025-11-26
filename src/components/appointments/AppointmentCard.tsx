import React from "react";
import { Card, Space, Tag, Typography, Avatar, Button, Popconfirm } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { IAppointment } from "../../types/health";
import { getStatusConfig } from "./appointment.utils";
import dayjs from "dayjs";

const { Text } = Typography;

interface AppointmentCardProps {
  appointment: IAppointment;
  onConfirm?: (apt: IAppointment) => void;
  onCancel?: (apt: IAppointment) => void;
  onEdit?: (apt: IAppointment) => void;
  variant?: "calendar" | "list";
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment: apt,
  onCancel,
  onEdit,
  variant = "calendar",
}) => {
  const config = getStatusConfig(apt.status);
  const aptDate = dayjs(apt.time || apt.appointmentDate);

  // Compact view for calendar
  if (variant === "calendar") {
    return (
      <Card
        size="small"
        style={{ width: "100%" }}
        styles={{ body: { padding: 12 } }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {/* Time & Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text strong>
              <ClockCircleOutlined /> {aptDate.format("HH:mm")}
            </Text>
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
          </div>

          {/* Info */}
          <div>
            <MedicineBoxOutlined style={{ marginRight: 6, color: "#1890ff" }} />
            <Text strong>{apt.doctor?.fullName || apt.doctorName || "N/A"}</Text>
          </div>
          <div>
            <UserOutlined style={{ marginRight: 6, color: "#52c41a" }} />
            <Text>{apt.member?.fullName || apt.patientName || "N/A"}</Text>
          </div>
          <div>
            <EnvironmentOutlined style={{ marginRight: 6, color: "#fa8c16" }} />
            <Text type="secondary">{apt.location}</Text>
          </div>

          {apt.note && (
            <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                📝 {apt.note}
              </Text>
            </div>
          )}

          {/* Actions - Chỉ hiển thị nút hủy cho người dùng */}
          {(apt.status === "SCHEDULED" || apt.status === "pending") && onCancel && (
            <Popconfirm
              title="Hủy lịch hẹn"
              description="Bạn có chắc muốn hủy?"
              onConfirm={() => onCancel(apt)}
              okText="Hủy lịch"
              cancelText="Không"
            >
              <Button
                style={{ height: "35px", width: "100%" }}
                danger
                size="small"
                icon={<CloseOutlined />}
              >
                Hủy lịch hẹn
              </Button>
            </Popconfirm>
          )}
          {(apt.status === "CONFIRMED" || apt.status === "confirmed") && onEdit && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(apt)}
              block
            >
              Chỉnh sửa
            </Button>
          )}
        </Space>
      </Card>
    );
  }

  // Full view for list
  const isUpcoming = aptDate.isAfter(dayjs());
  const isPast = aptDate.isBefore(dayjs());
  const borderColor = isUpcoming ? "#1890ff" : isPast ? "#d9d9d9" : "#52c41a";

  return (
    <Card
      hoverable
      style={{ width: "100%", borderLeft: `4px solid ${borderColor}` }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        {/* Date Box */}
        <div
          style={{
            minWidth: 120,
            textAlign: "center",
            padding: 12,
            background: "#f0f5ff",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: "bold" }}>
            {aptDate.format("DD")}
          </div>
          <div style={{ color: "#666" }}>Tháng {aptDate.format("MM/YYYY")}</div>
          <div style={{ color: "#1890ff", fontWeight: 500, marginTop: 4 }}>
            <ClockCircleOutlined /> {aptDate.format("HH:mm")}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <div>
              <Avatar
                size="small"
                icon={<MedicineBoxOutlined />}
                style={{ backgroundColor: "#1890ff", marginRight: 8 }}
              />
              <Text strong>BS. {apt.doctor?.fullName || apt.doctorName || "Chưa xác định"}</Text>
            </div>
            <div>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: "#52c41a", marginRight: 8 }}
              />
              <Text>{apt.member?.fullName || apt.patientName || "Chưa xác định"}</Text>
            </div>
            <div>
              <EnvironmentOutlined
                style={{ marginRight: 8, color: "#fa8c16" }}
              />
              <Text type="secondary">{apt.location}</Text>
            </div>
            {apt.note && (
              <div
                style={{ background: "#f5f5f5", padding: 8, borderRadius: 4 }}
              >
                <Text type="secondary" style={{ fontSize: 13 }}>
                  📝 {apt.note}
                </Text>
              </div>
            )}
          </Space>
        </div>

        {/* Status & Actions */}
        <div
          style={{
            minWidth: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <Tag
            color={config.color}
            icon={config.icon}
            style={{ marginRight: 0, fontSize: 13 }}
          >
            {config.text}
          </Tag>
          {isUpcoming && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Còn {aptDate.diff(dayjs(), "day")} ngày
            </Text>
          )}

          {/* Actions - Chỉ hiển thị nút hủy cho người dùng */}
          {(apt.status === "SCHEDULED" || apt.status === "pending") && onCancel && (
            <Popconfirm
              title="Hủy lịch hẹn"
              description="Bạn có chắc muốn hủy?"
              onConfirm={() => onCancel(apt)}
              okText="Hủy lịch"
              cancelText="Không"
            >
              <Button
                style={{ height: "35px", marginTop: 8 }}
                danger
                size="small"
                icon={<CloseOutlined />}
                block
              >
                Hủy lịch hẹn
              </Button>
            </Popconfirm>
          )}
          {(apt.status === "CONFIRMED" || apt.status === "confirmed") && onEdit && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(apt)}
              block
              style={{ marginTop: 8 }}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
