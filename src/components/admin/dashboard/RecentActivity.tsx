import React from "react";
import { Card, List, Avatar, Typography } from "antd";
import {
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const iconMap: Record<string, React.ReactNode> = {
  calendar: <CalendarOutlined style={{ color: "#1890ff" }} />,
  file: <FileTextOutlined style={{ color: "#52c41a" }} />,
  user: <UserOutlined style={{ color: "#722ed1" }} />,
  doctor: <MedicineBoxOutlined style={{ color: "#eb2f96" }} />,
  check: <CheckCircleOutlined style={{ color: "#13c2c2" }} />,
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card title="Hoạt động gần đây">
      <List
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={iconMap[item.icon] || <UserOutlined />} />}
              title={item.message}
              description={<Text type="secondary">{item.time}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivity;
