import React, { useState } from "react";
import { Form, Input, Button, Space, App as AntApp } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { setUserLoginInfo } from "../../redux/slice/accountSlice";
import { authService } from "../../services/authService";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { message } = AntApp.useApp();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Bắt đầu đăng nhập
      let res;
      try {
        res = await authService.login({
          phone: values.username,
          password: values.password,
        });
      } catch (err: any) {
        // Nếu backend trả về lỗi (404, 401, ...), luôn show message
        const errorMsg = err?.message || "Đăng nhập thất bại";
        console.error("[LOGIN ERROR - API]", errorMsg, err);
        message.error({ content: errorMsg, duration: 5 });
        setLoading(false);
        return;
      }

      if (res && res.code === 200 && res.data) {
        // Lưu token và userId
        authService.setTokens(
          res.data.accessToken,
          res.data.refreshToken,
          res.data.userId
        );
        // Lấy profile
        try {
          const profileRes = await authService.getProfile();
          if (profileRes && profileRes.data) {
            const userData = profileRes.data;
            const userInfo = {
              id: userData.id,
              email: userData.email || '',
              name: userData.fullName,
              phone: userData.phone,
              role: { id: '', name: userData.roleName },
            };
            authService.setUserInfo(userInfo);
            dispatch(setUserLoginInfo(userInfo));
          }
        } catch (profileErr) {
          // Không lấy được profile vẫn cho vào hệ thống
        }
        message.success(res.message || "Đăng nhập thành công");
        navigate("/");
      } else {
        // Nếu response không hợp lệ, vẫn báo lỗi rõ ràng
        let errorMsg = "Đăng nhập thất bại";
        if (res && res.message) {
          errorMsg = res.message;
        }
        console.error("[LOGIN FAIL]", errorMsg);
        message.error({ content: errorMsg, duration: 5 });
      }
    } catch (err: any) {
      // Bắt mọi lỗi, kể cả lỗi không có message
      let errorMsg = "Đăng nhập thất bại";
      if (err?.message) {
        errorMsg = err.message;
      }
      console.error("[LOGIN ERROR]", errorMsg, err);
      message.error({ content: errorMsg, duration: 5 });
    } finally {
      setLoading(false);
    }
  };

    return (
      <AntApp>
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
                label={<span style={{ fontSize: 14, fontWeight: 500 }}>Số điện thoại</span>}
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#cbd5e0" }} />}
                  placeholder="0123456789"
                  style={{ height: 48 }}
                  maxLength={11}
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
      </AntApp>
    );
};

export default Login;
