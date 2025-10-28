import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Space, App, Tag } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { IFamilyMember } from "../../types/health";

interface EditMemberModalProps {
  open: boolean;
  member: IFamilyMember | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  open,
  member,
  onClose,
  onSuccess,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && member) {
      form.setFieldsValue({
        name: member.name,
        relation: member.relation,
        dob: member.dob ? dayjs(member.dob) : null,
        healthStatus: member.healthStatus,
        notes: member.notes,
      });
    } else {
      form.resetFields();
    }
  }, [open, member, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Update member:", { ...member, ...values });
      message.success("Cập nhật thành công");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <EditOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            Chỉnh sửa thông tin
          </span>
        </Space>
      }
      open={open}
      onOk={handleSave}
      onCancel={onClose}
      okText="Cập nhật"
      cancelText="Hủy"
      width={700}
      centered
      destroyOnHidden
    >
      <div style={{ padding: "16px 0" }}>
        <Form form={form} layout="vertical" size="large">
          <Form.Item
            label={
              <span>
                <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                Họ và tên
              </span>
            }
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input
              placeholder="Nhập họ và tên"
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label="Quan hệ"
            name="relation"
            rules={[{ required: true, message: "Vui lòng chọn quan hệ" }]}
          >
            <Select placeholder="-- Chọn quan hệ --">
              <Select.Option value="Cha">Cha</Select.Option>
              <Select.Option value="Mẹ">Mẹ</Select.Option>
              <Select.Option value="Con">Con</Select.Option>
              <Select.Option value="Anh/Chị/Em">Anh/Chị/Em</Select.Option>
              <Select.Option value="Vợ/Chồng">Vợ/Chồng</Select.Option>
              <Select.Option value="Ông/Bà">Ông/Bà</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ngày sinh" name="dob">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item label="Tình trạng sức khỏe" name="healthStatus">
            <Select
              placeholder="-- Chọn tình trạng --"
              optionRender={(option) => option.data.label}
            >
              <Select.Option
                value="Khỏe mạnh"
                label={<Tag color="green">Khỏe mạnh</Tag>}
              >
                <Tag color="green">Khỏe mạnh</Tag>
              </Select.Option>
              <Select.Option
                value="Bình thường"
                label={<Tag color="cyan">Bình thường</Tag>}
              >
                <Tag color="cyan">Bình thường</Tag>
              </Select.Option>
              <Select.Option
                value="Đang điều trị"
                label={<Tag color="orange">Đang điều trị</Tag>}
              >
                <Tag color="orange">Đang điều trị</Tag>
              </Select.Option>
              <Select.Option
                value="Cần theo dõi"
                label={<Tag color="gold">Cần theo dõi</Tag>}
              >
                <Tag color="gold">Cần theo dõi</Tag>
              </Select.Option>
              <Select.Option
                value="Nghiêm trọng"
                label={<Tag color="red">Nghiêm trọng</Tag>}
              >
                <Tag color="red">Nghiêm trọng</Tag>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea
              rows={3}
              placeholder="Ghi chú thêm thông tin..."
              showCount
              maxLength={300}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditMemberModal;
