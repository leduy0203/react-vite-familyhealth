import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Space, Typography, Tag, Spin, App } from "antd";
import {
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { type IFamilyMemberNew, getRelationText, getGenderText, familyService } from "../../services/familyService";

const { Text } = Typography;

interface ViewMemberModalProps {
  open: boolean;
  member: IFamilyMemberNew | null;
  onClose: () => void;
}

const ViewMemberModal: React.FC<ViewMemberModalProps> = ({
  open,
  member,
  onClose,
}) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [memberDetail, setMemberDetail] = useState<IFamilyMemberNew | null>(null);

  useEffect(() => {
    if (open && member?.id) {
      loadMemberDetail(member.id);
    }
  }, [open, member?.id]);

  const loadMemberDetail = async (id: number) => {
    setLoading(true);
    try {
      const response = await familyService.getById(id);
      setMemberDetail(response.data);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Không thể tải thông tin thành viên");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const displayMember = memberDetail || member;
  if (!displayMember) return null;

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
      <Spin spinning={loading}>
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
              {displayMember.fullname || "N/A"}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined style={{ color: "#52c41a" }} />
                <span>Số CCCD</span>
              </Space>
            }
          >
            <Text>{displayMember.idCard || "Chưa có"}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                {displayMember.gender === "MALE" ? (
                  <ManOutlined style={{ color: "#1890ff" }} />
                ) : (
                  <WomanOutlined style={{ color: "#eb2f96" }} />
                )}
                <span>Giới tính</span>
              </Space>
            }
          >
            <Text>{getGenderText(displayMember.gender)}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined style={{ color: "#faad14" }} />
                <span>Ngày sinh</span>
              </Space>
            }
          >
            {displayMember.dateOfBirth
              ? new Date(displayMember.dateOfBirth).toLocaleDateString("vi-VN")
              : "Chưa có thông tin"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <UserOutlined style={{ color: "#722ed1" }} />
                <span>Quan hệ</span>
              </Space>
            }
          >
            <Tag color={displayMember.relation === "CHU_HO" ? "blue" : "default"}>
              {getRelationText(displayMember.relation)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined style={{ color: "#13c2c2" }} />
                <span>Số BHYT</span>
              </Space>
            }
          >
            <Text>{displayMember.bhyt || "Chưa có"}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <EnvironmentOutlined style={{ color: "#f5222d" }} />
                <span>Địa chỉ</span>
              </Space>
            }
          >
            <Text>{displayMember.address || "Chưa có thông tin"}</Text>
          </Descriptions.Item>

          {displayMember.email && (
            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined style={{ color: "#1890ff" }} />
                  <span>Email</span>
                </Space>
              }
            >
              <Text>{displayMember.email}</Text>
            </Descriptions.Item>
          )}

          {displayMember.household && (
            <Descriptions.Item
              label={
                <Space>
                  <HomeOutlined style={{ color: "#52c41a" }} />
                  <span>Thông tin hộ khẩu</span>
                </Space>
              }
            >
              <Space direction="vertical" size="small">
                <Text>
                  <Text strong>ID:</Text> {displayMember.household.id}
                </Text>
                <Text>
                  <Text strong>Số lượng:</Text> {displayMember.household.quantity} người
                </Text>
                <Text>
                  <Text strong>Trạng thái:</Text>{" "}
                  <Tag color={displayMember.household.isActive ? "green" : "red"}>
                    {displayMember.household.isActive ? "Hoạt động" : "Không hoạt động"}
                  </Tag>
                </Text>
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>

        {displayMember.id && (
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
              ID: {displayMember.id}
            </Text>
          </div>
        )}
        </div>
      </Spin>
    </Modal>
  );
};

export default ViewMemberModal;
