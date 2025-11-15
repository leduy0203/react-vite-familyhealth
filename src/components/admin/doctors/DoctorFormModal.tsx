import React from "react";
import { Modal, Form, Input, DatePicker, Select, Row, Col, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EXPERTISE_LABELS } from "../../../constants/expertise";

interface DoctorFormModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading?: boolean;
}

const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
  open,
  onCancel,
  onFinish,
  loading = false,
}) => {
  const [form] = Form.useForm();

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
          <span>Thêm bác sĩ mới</span>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      width={900}
      okText="Thêm bác sĩ"
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
        {/* Row 1: Thông tin tài khoản */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 12,
              color: "#1890ff",
            }}
          >
            📱 Thông tin tài khoản
          </div>
          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  {
                    min: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự!",
                  },
                ]}
              >
                <Input.Password placeholder="Mật khẩu mạnh" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Row 2: Thông tin cá nhân */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 12,
              color: "#1890ff",
            }}
          >
            👤 Thông tin cá nhân
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="CMND/CCCD"
                name="idCard"
                rules={[
                  { required: true, message: "Vui lòng nhập CMND/CCCD!" },
                  {
                    pattern: /^[0-9]{9,12}$/,
                    message: "CMND/CCCD không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="001234567890" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
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
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                  disabledDate={(current) =>
                    current && current > dayjs().subtract(18, "years")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="doctor@clinic.vn" />
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
                  placeholder="Số nhà, Đường, Quận, Thành phố"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Row 3: Thông tin chuyên môn */}
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 12,
              color: "#1890ff",
            }}
          >
            🩺 Thông tin chuyên môn
          </div>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Chuyên khoa"
                name="expertise"
                rules={[
                  { required: true, message: "Vui lòng chọn chuyên khoa!" },
                ]}
              >
                <Select placeholder="Chọn chuyên khoa">
                  {Object.entries(EXPERTISE_LABELS).map(([key, label]) => (
                    <Select.Option key={key} value={key}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tiểu sử nghề nghiệp"
                name="bio"
                rules={[
                  { required: true, message: "Vui lòng nhập tiểu sử!" },
                  { min: 20, message: "Tiểu sử phải có ít nhất 20 ký tự!" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả về kinh nghiệm, chuyên môn của bác sĩ..."
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default DoctorFormModal;
