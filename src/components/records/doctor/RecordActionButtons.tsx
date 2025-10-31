import React from "react";
import { Space, Button, Tooltip, Dropdown, type MenuProps } from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { IMedicalRecord } from "../../../types/health";

interface RecordActionButtonsProps {
  record: IMedicalRecord;
  onView: (record: IMedicalRecord) => void;
  onMarkViewed: (record: IMedicalRecord) => void;
  onSuggestAppointment?: (record: IMedicalRecord) => void;
  onPrescribe?: (record: IMedicalRecord) => void;
  compact?: boolean;
}

const RecordActionButtons: React.FC<RecordActionButtonsProps> = ({
  record,
  onView,
  onMarkViewed,
  onSuggestAppointment,
  onPrescribe,
  compact = false,
}) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "view",
      label: "Xem chi tiết",
      icon: <EyeOutlined />,
      onClick: () => onView(record),
    },
    record.status === "new" || record.status === "transferred"
      ? {
          key: "markViewed",
          label: "Đánh dấu đã xem",
          icon: <CheckCircleOutlined />,
          onClick: () => onMarkViewed(record),
        }
      : null,
    onSuggestAppointment
      ? {
          key: "appointment",
          label: "Đề xuất lịch hẹn",
          icon: <CalendarOutlined />,
          onClick: () => onSuggestAppointment(record),
        }
      : null,
    onPrescribe
      ? {
          key: "prescribe",
          label: "Kê đơn thuốc",
          icon: <MedicineBoxOutlined />,
          onClick: () => onPrescribe(record),
        }
      : null,
  ].filter(Boolean) as MenuProps["items"];

  if (compact) {
    return (
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <Button icon={<MoreOutlined />} size="small">
          Thao tác
        </Button>
      </Dropdown>
    );
  }

  return (
    <Space>
      <Tooltip title="Xem chi tiết">
        <Button
          type="default"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onView(record)}
        />
      </Tooltip>

      {(record.status === "new" || record.status === "transferred") && (
        <Tooltip title="Đánh dấu đã xem">
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => onMarkViewed(record)}
          />
        </Tooltip>
      )}

      {onSuggestAppointment && (
        <Tooltip title="Đề xuất lịch hẹn">
          <Button
            size="small"
            icon={<CalendarOutlined />}
            onClick={() => onSuggestAppointment(record)}
          />
        </Tooltip>
      )}

      {onPrescribe && (
        <Tooltip title="Kê đơn thuốc">
          <Button
            size="small"
            icon={<MedicineBoxOutlined />}
            onClick={() => onPrescribe(record)}
          />
        </Tooltip>
      )}
    </Space>
  );
};

export default RecordActionButtons;
