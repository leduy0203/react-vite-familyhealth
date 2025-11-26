import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Space, App, Spin } from "antd";
import { EditOutlined, UserOutlined, IdcardOutlined, MailOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { type IFamilyMemberNew, familyService } from "../../services/familyService";

interface EditMemberModalProps {
  open: boolean;
  member: IFamilyMemberNew | null;
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
  const [loading, setLoading] = useState(false);
  const [memberDetail, setMemberDetail] = useState<IFamilyMemberNew | null>(null);

  useEffect(() => {
    if (open && member?.id) {
      loadMemberDetail(member.id);
    } else {
      form.resetFields();
      setMemberDetail(null);
    }
  }, [open, member?.id]);

  const loadMemberDetail = async (id: number) => {
    setLoading(true);
    try {
      const response = await familyService.getById(id);
      const detail = response.data;
      setMemberDetail(detail);
      form.setFieldsValue({
        fullname: detail.fullname,
        idCard: detail.idCard,
        gender: detail.gender,
        dateOfBirth: detail.dateOfBirth ? dayjs(detail.dateOfBirth) : null,
        relation: detail.relation,
        bhyt: detail.bhyt,
        address: detail.address,
        email: detail.email,
      });
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Không thể tải thông tin thành viên");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!memberDetail) return;
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null,
      };
      await familyService.update(memberDetail.id, payload);
      message.success("Cập nhật thành công");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Cập nhật thất bại");
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
      <Spin spinning={loading}>
        <div style={{ padding: "16px 0" }}>
        <Form form={form} layout="vertical" size="middle">
          <Form.Item
            label="Họ và tên"
            name="fullname"
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
            label="Số CCCD"
            name="idCard"
            rules={[
              { required: true, message: "Vui lòng nhập số CCCD" },
              { pattern: /^[0-9]{9,12}$/, message: "CCCD phải có 9-12 chữ số" },
            ]}
          >
            <Input
              placeholder="Nhập số CCCD"
              prefix={<IdcardOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Quan hệ"
            name="relation"
            rules={[{ required: true, message: "Vui lòng chọn quan hệ" }]}
          >
            <Select placeholder="Chọn quan hệ">
              <Select.Option value="CHU_HO">Chủ hộ</Select.Option>
              <Select.Option value="VO">Vợ</Select.Option>
              <Select.Option value="CHONG">Chồng</Select.Option>
              <Select.Option value="CON">Con</Select.Option>
              <Select.Option value="BO">Bố</Select.Option>
              <Select.Option value="ME">Mẹ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Số BHYT"
            name="bhyt"
            rules={[
              { pattern: /^[0-9]{10,15}$/, message: "BHYT phải có 10-15 chữ số" },
            ]}
          >
            <Input
              placeholder="Nhập số BHYT (tùy chọn)"
              prefix={<IdcardOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập địa chỉ đầy đủ"
            />
          </Form.Item>

          <Form.Item
            label="Email (tùy chọn)"
            name="email"
            rules={[
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              placeholder="Nhập email"
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>
        </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default EditMemberModal;
