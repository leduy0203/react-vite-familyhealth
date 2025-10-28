import {
  ExclamationCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { IAppointment } from "../../types/health";

export const getStatusConfig = (status: IAppointment["status"]) => {
  const configs = {
    pending: {
      color: "gold",
      text: "Chờ xác nhận",
      icon: <ExclamationCircleOutlined />,
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
  return configs[status];
};
