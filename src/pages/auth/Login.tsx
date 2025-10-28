import React, { useState } from "react";
import { Form, Input, Button, message, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { setUserLoginInfo } from "../../redux/slice/accountSlice";
import { api } from "../../config/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.login(values.username, values.password);
      if (res && res.data) {
        localStorage.setItem("access_token", res.data.access_token);
        dispatch(setUserLoginInfo(res.data.user));
        message.success("Đăng nhập thành công");
        navigate("/");
      }
    } catch (err: any) {
      message.error(err?.message || "Đăng nhập thất bại");
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
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 450,
          padding: "48px 40px",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Space
            direction="vertical"
            size={8}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FaHeartbeat
              style={{ fontSize: 56, color: "#0ea5e9", marginBottom: 8 }}
            />
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                color: "#1a202c",
              }}
            >
              FamilyHealth
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#718096",
                margin: 0,
              }}
            >
              Quản lý sức khỏe gia đình toàn diện
            </p>
          </Space>
        </div>

        {/* Form */}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            label={<span style={{ fontSize: 14, fontWeight: 500 }}>Email</span>}
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
            style={{ marginBottom: 20 }}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#cbd5e0" }} />}
              placeholder="email@example.com"
              style={{ height: 48 }}
            />
          </Form.Item>
          <Form.Item
            label={
              <span style={{ fontSize: 14, fontWeight: 500 }}>Mật khẩu</span>
            }
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            style={{ marginBottom: 28 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#cbd5e0" }} />}
              placeholder="Nhập mật khẩu"
              style={{ height: 48 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ fontSize: 14, color: "#718096" }}>
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              style={{
                color: "#0ea5e9",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
