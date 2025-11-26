import {
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { IAppointment } from "../../types/health";

export const getStatusConfig = (status: IAppointment["status"]) => {
  const configs = {
    SCHEDULED: {
      color: "orange",
      text: "Chờ xác nhận",
      icon: <ClockCircleOutlined />,
    },
    CONFIRMED: {
      color: "blue",
      text: "Đã xác nhận",
      icon: <CheckCircleOutlined />,
    },
    COMPLETED: {
      color: "green",
      text: "Hoàn thành",
      icon: <CheckCircleOutlined />,
    },
    CANCELLED: {
      color: "red",
      text: "Đã hủy",
      icon: <CloseCircleOutlined />,
    },
    // Legacy statuses for backward compatibility
    pending: {
      color: "orange",
      text: "Chờ xác nhận",
      icon: <ClockCircleOutlined />,
    },
    confirmed: {
      color: "blue",
      text: "Đã xác nhận",
      icon: <SyncOutlined spin />,
    },
    completed: {
      color: "green",
      text: "Hoàn thành",
      icon: <CheckCircleOutlined />,
    },
    cancelled: {
      color: "red",
      text: "Đã hủy",
      icon: <CloseCircleOutlined />,
    },
  };
  return configs[status] || configs.SCHEDULED;
};
