import React, { useState } from "react";
import { Modal, Form, Input, Select, Switch, Space, Row, Col, DatePicker } from "antd";
import { PlusOutlined, IdcardOutlined } from "@ant-design/icons";

interface UserFormModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading?: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onCancel,
  onFinish,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<number>(4);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: any) => {
    onFinish(values);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined />
          <span>Thêm người dùng mới</span>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      width={600}
      okText="Thêm người dùng"
      cancelText="Hủy"
      confirmLoading={loading}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 20 }}
      >
        {/* Số điện thoại */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số!",
                },
              ]}
            >
              <Input placeholder="0987654321" />
            </Form.Item>
          </Col>
        </Row>

        {/* Mật khẩu */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </Col>
        </Row>

        {/* Vai trò */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Vai trò"
              name="role_id"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              initialValue={4}
            >
              <Select 
                placeholder="Chọn vai trò"
                onChange={(value) => setSelectedRole(value)}
              >
                <Select.Option value={1}>
                  <span style={{ color: "#ff4d4f", fontWeight: 600 }}>
                    ADMIN
                  </span>
                </Select.Option>
                <Select.Option value={4}>
                  <span style={{ color: "#52c41a", fontWeight: 600 }}>
                    PATIENT_HOUSEHOLD (Chủ hộ)
                  </span>
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Trạng thái */}
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="isActive"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                checkedChildren="Hoạt động"
                unCheckedChildren="Khóa"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Thông tin cá nhân - Chỉ hiển thị khi chọn PATIENT_HOUSEHOLD */}
        {selectedRole === 4 && (
          <>
            <div style={{ 
              borderTop: "1px solid #f0f0f0", 
              marginTop: 16, 
              paddingTop: 16,
              marginBottom: 8 
            }}>
              <strong style={{ fontSize: 14, color: "#1890ff" }}>
                📋 Thông tin chủ hộ gia đình
              </strong>
            </div>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Select.Option value="MALE">Nam</Select.Option>
                    <Select.Option value="FEMALE">Nữ</Select.Option>
                    <Select.Option value="OTHER">Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày sinh"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số CCCD/CMND"
                  name="cccd"
                  rules={[
                    { required: true, message: "Vui lòng nhập CCCD!" },
                    { pattern: /^[0-9]{9,12}$/, message: "CCCD phải có 9-12 chữ số!" },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined />}
                    placeholder="001234567890"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số BHYT (tùy chọn)"
                  name="bhyt"
                  rules={[
                    { pattern: /^[0-9]{10,15}$/, message: "BHYT phải có 10-15 chữ số!" },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined />}
                    placeholder="066204001282"
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* Note */}
        <div
          style={{
            padding: "12px",
            background: "#f0f2f5",
            borderRadius: 6,
            fontSize: 13,
            color: "#666",
            marginTop: 16,
          }}
        >
          <strong>Lưu ý:</strong>
          <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
            <li>
              <strong>ADMIN</strong>: Chỉ cần số điện thoại và mật khẩu
            </li>
            <li>
              <strong>PATIENT_HOUSEHOLD</strong>: Cần đầy đủ thông tin cá nhân (chủ hộ gia đình)
            </li>
            <li>Bác sĩ được quản lý ở trang <strong style={{ color: "#1890ff" }}>Quản lý bác sĩ</strong></li>
            <li>Số điện thoại phải là duy nhất trong hệ thống</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
