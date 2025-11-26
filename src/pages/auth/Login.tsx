import React, { useState } from "react";
import { Form, Input, Button, message, Space } from "antd";
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

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log("🔐 Starting login...", values);
      
      // Call authentication service
      const res = await authService.login({
        phone: values.username,
        password: values.password,
      });
      
      console.log("✅ Login response:", res);
      
      if (res && res.code === 200 && res.data) {
        console.log("💾 Storing tokens...");
        // Store tokens and userId
        authService.setTokens(
          res.data.accessToken,
          res.data.refreshToken,
          res.data.userId
        );
        
        console.log("👤 Fetching user profile...");
        // Fetch user profile to get full user info
        try {
          const profileRes = await authService.getProfile();
          console.log("✅ Profile response:", profileRes);
          
          if (profileRes && profileRes.data) {
            const userData = profileRes.data;
            // Transform backend data to match IUser interface
            const userInfo = {
              id: userData.id,
              email: userData.email || '',
              name: userData.fullName,
              phone: userData.phone,
              role: { id: '', name: userData.roleName },
            };
            console.log("💾 Setting user info:", userInfo);
            authService.setUserInfo(userInfo);
            dispatch(setUserLoginInfo(userInfo));
            console.log("✅ User info dispatched to Redux");
          }
        } catch (profileErr) {
          console.error("❌ Failed to fetch profile:", profileErr);
          // Even if profile fetch fails, still navigate to dashboard
          // User can view limited info from token
        }
        
        console.log("🚀 Navigating to dashboard...");
        message.success(res.message || "Đăng nhập thành công");
        navigate("/");
        console.log("✅ Navigate called");
      } else {
        console.warn("⚠️ Invalid response:", res);
        message.error("Đăng nhập thất bại - Response không hợp lệ");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      message.error(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
      console.log("🏁 Login process finished");
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
  );
};

export default Login;
