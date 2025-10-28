import React from "react";
import { Modal, Descriptions, Space, Typography, Tag } from "antd";
import {
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { IFamilyMember } from "../../types/health";

const { Text } = Typography;

interface ViewMemberModalProps {
  open: boolean;
  member: IFamilyMember | null;
  onClose: () => void;
}

const ViewMemberModal: React.FC<ViewMemberModalProps> = ({
  open,
  member,
  onClose,
}) => {
  if (!member) return null;

  return (
    <Modal
      title={
        <Space>
          <EyeOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            Thông tin thành viên
          </span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <div style={{ padding: "16px 0" }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item
            label={
              <Space>
                <UserOutlined style={{ color: "#1890ff" }} />
                <span>Họ và tên</span>
              </Space>
            }
          >
            <Text strong style={{ fontSize: "15px" }}>
              {member.name || "N/A"}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <UserOutlined style={{ color: "#52c41a" }} />
                <span>Quan hệ</span>
              </Space>
            }
          >
            <Tag color="blue">{member.relation || "Chưa xác định"}</Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined style={{ color: "#faad14" }} />
                <span>Ngày sinh</span>
              </Space>
            }
          >
            {member.dob
              ? new Date(member.dob).toLocaleDateString("vi-VN")
              : "Chưa có thông tin"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <HeartOutlined style={{ color: "#f5222d" }} />
                <span>Tình trạng sức khỏe</span>
              </Space>
            }
          >
            <Text>{member.healthStatus || "Chưa có thông tin"}</Text>
          </Descriptions.Item>

          {member.notes && (
            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined style={{ color: "#722ed1" }} />
                  <span>Ghi chú</span>
                </Space>
              }
            >
              <Text type="secondary">{member.notes}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>

        {member.id && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#fafafa",
              borderRadius: "6px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Text type="secondary" style={{ fontSize: "12px" }}>
              ID: {member.id}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewMemberModal;
