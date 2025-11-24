import React, { useState } from "react";
import { Form, Input, Button, message, Space, DatePicker, Select, Row, Col } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import dayjs from "dayjs";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        phone: values.phone,
        password: values.password,
        roleId: 3, // PATIENT
        isActive: true,
        memberInfo: {
          fullName: values.fullName,
          address: values.address,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
          cccd: values.cccd,
          bhyt: values.bhyt || null,
        },
      };

      await axiosInstance.post("/users/register", payload);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
        padding: "20px 15px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,
          padding: "24px 32px",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Space
            direction="vertical"
            size={4}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FaHeartbeat
              style={{ fontSize: 40, color: "#0ea5e9", marginBottom: 4 }}
            />
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                margin: 0,
                color: "#1a202c",
              }}
            >
              Đăng ký tài khoản
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "#718096",
                margin: 0,
              }}
            >
              Tạo tài khoản bệnh nhân mới
            </p>
          </Space>
        </div>

        {/* Form */}
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="middle"
          requiredMark={false}
        >
          {/* Thông tin tài khoản */}
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a202c", marginBottom: 8 }}>
              📱 Thông tin đăng nhập
            </h3>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontSize: 13, fontWeight: 500 }}>Số điện thoại</span>}
                  name="phone"
                  rules={[
                    { required: true, message: "Nhập SĐT" },
                    { pattern: /^[0-9]{10}$/, message: "SĐT phải có 10 chữ số" },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: "#cbd5e0" }} />}
                    placeholder="0987654321"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontSize: 13, fontWeight: 500 }}>Mật khẩu</span>}
                  name="password"
                  rules={[
                    { required: true, message: "Nhập mật khẩu" },
                    { min: 6, message: "Tối thiểu 6 ký tự" },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#cbd5e0" }} />}
                    placeholder="Nhập mật khẩu"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 500 }}>Xác nhận mật khẩu</span>}
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp"));
                  },
                }),
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#cbd5e0" }} />}
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>
          </div>

          {/* Thông tin cá nhân */}
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a202c", marginBottom: 8 }}>
              👤 Thông tin cá nhân
            </h3>
            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 500 }}>Họ và tên</span>}
              name="fullName"
              rules={[{ required: true, message: "Nhập họ tên" }]}
              style={{ marginBottom: 12 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#cbd5e0" }} />}
                placeholder="Nguyễn Văn A"
              />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontSize: 13, fontWeight: 500 }}>Giới tính</span>}
                  name="gender"
                  rules={[{ required: true, message: "Chọn giới tính" }]}
                  style={{ marginBottom: 12 }}
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
                  label={<span style={{ fontSize: 13, fontWeight: 500 }}>Ngày sinh</span>}
                  name="dateOfBirth"
                  rules={[{ required: true, message: "Chọn ngày sinh" }]}
                  style={{ marginBottom: 12 }}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày sinh"
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current > dayjs().endOf("day")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 500 }}>Địa chỉ</span>}
              name="address"
              rules={[{ required: true, message: "Nhập địa chỉ" }]}
              style={{ marginBottom: 12 }}
            >
              <Input.TextArea
                rows={2}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontSize: 13, fontWeight: 500 }}>Số CCCD/CMND</span>}
                  name="cccd"
                  rules={[
                    { required: true, message: "Nhập CCCD" },
                    { pattern: /^[0-9]{9,12}$/, message: "CCCD: 9-12 chữ số" },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    prefix={<IdcardOutlined style={{ color: "#cbd5e0" }} />}
                    placeholder="001234567890"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ fontSize: 13, fontWeight: 500 }}>Số BHYT (tùy chọn)</span>}
                  name="bhyt"
                  rules={[
                    { pattern: /^[0-9]{10,15}$/, message: "BHYT: 10-15 chữ số" },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    prefix={<IdcardOutlined style={{ color: "#cbd5e0" }} />}
                    placeholder="066204001282"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 42,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p style={{ fontSize: 13, color: "#718096", margin: 0 }}>
            Đã có tài khoản?{" "}
            <a
              href="/login"
              style={{
                color: "#0ea5e9",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
