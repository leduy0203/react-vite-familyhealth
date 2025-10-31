import React, { useState } from "react";
import { Modal, Form, Input, Select, Checkbox, App, Row, Col } from "antd";
import type { ISystemUser } from "../../../redux/slice/userSlice";

const { Option } = Select;

interface UserFormModalProps {
  open: boolean;
  user: ISystemUser | null;
  onClose: () => void;
  onSave: (user: Partial<ISystemUser>) => Promise<void>;
}

const ALL_PERMISSIONS = [
  { value: "view_dashboard", label: "Xem Dashboard" },
  { value: "view_profile", label: "Xem Profile" },
  { value: "view_records", label: "Xem Hồ sơ" },
  { value: "view_family", label: "Xem Gia đình" },
  { value: "view_patients", label: "Xem Bệnh nhân" },
  { value: "view_appointments", label: "Xem Lịch hẹn" },
  { value: "view_doctor_appointments", label: "Xem Lịch bác sĩ" },
  { value: "view_prescriptions", label: "Xem Đơn thuốc" },
  { value: "view_doctors", label: "Xem Bác sĩ" },
  { value: "view_doctor_queue", label: "Xem Hồ sơ bác sĩ" },
  { value: "create_appointment", label: "Tạo Lịch hẹn" },
  { value: "create_prescription", label: "Tạo Đơn thuốc" },
  { value: "transfer_record", label: "Chuyển Hồ sơ" },
  { value: "create_record", label: "Tạo Hồ sơ" },
  { value: "mark_record_viewed", label: "Đánh dấu đã xem Hồ sơ" },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ALL_PERMISSIONS.map((p) => p.value),
  doctor: [
    "view_dashboard",
    "view_profile",
    "view_patients",
    "view_doctor_appointments",
    "view_prescriptions",
    "view_doctors",
    "view_doctor_queue",
    "create_appointment",
    "create_prescription",
    "mark_record_viewed",
  ],
  user: [
    "view_dashboard",
    "view_profile",
    "view_records",
    "view_family",
    "view_doctors",
    "create_record",
    "transfer_record",
    "view_appointments",
  ],
};

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  user,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role.id || "user");

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        roleId: user.role.id,
        permissions: user.permissions || [],
      });
      setSelectedRole(user.role.id);
    } else {
      form.resetFields();
      form.setFieldsValue({
        roleId: "user",
        permissions: ROLE_PERMISSIONS.user,
        status: "active",
      });
      setSelectedRole("user");
    }
  }, [user, form, open]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    form.setFieldsValue({
      permissions: ROLE_PERMISSIONS[roleId] || [],
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const userData: Partial<ISystemUser> = {
        ...values,
        role: {
          id: values.roleId,
          name:
            values.roleId === "admin"
              ? "Admin"
              : values.roleId === "doctor"
              ? "Doctor"
              : "User",
        },
      };

      if (user) {
        userData.id = user.id;
      }

      await onSave(userData);
      message.success(user ? "Cập nhật thành công" : "Thêm user thành công");
      onClose();
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={user ? "Sửa người dùng" : "Thêm người dùng mới"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
      okText={user ? "Cập nhật" : "Thêm"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="roleId"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select placeholder="Chọn vai trò" onChange={handleRoleChange}>
                <Option value="user">Người dùng</Option>
                <Option value="doctor">Bác sĩ</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item name="permissions" label="Quyền hạn">
          <Checkbox.Group style={{ width: "100%" }}>
            <Row gutter={[8, 8]}>
              {ALL_PERMISSIONS.map((perm) => (
                <Col span={12} key={perm.value}>
                  <Checkbox value={perm.value}>{perm.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
