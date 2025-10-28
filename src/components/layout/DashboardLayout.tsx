import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLogoutAction } from "../../redux/slice/accountSlice";
import "../../styles/layout.scss";
import { hasPermission } from "../../config/permissions";

const { Header, Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.account.user);
  const location = useLocation();
  const selectedKey = React.useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/appointments")) return ["4"];
    if (p.startsWith("/records")) return ["2"];
    if (p.startsWith("/patients")) return ["3"];
    if (p.startsWith("/family")) return ["5"];
    if (p.startsWith("/prescriptions")) return ["6"];
    if (p.startsWith("/doctor")) return ["7"];
    return ["1"];
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    dispatch(setLogoutAction());
    navigate("/login");
  };

  const menu = [
    {
      key: "profile",
      label: React.createElement(Link, { to: "/account/profile" }, "Tài khoản"),
      icon: React.createElement(UserOutlined),
    },
    {
      key: "logout",
      label: React.createElement("a", { onClick: handleLogout }, "Đăng xuất"),
      icon: React.createElement(LogoutOutlined),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(v) => setCollapsed(v)}
        theme="light"
      >
        <div
          className="logo"
          style={{ padding: 16, textAlign: "center", fontWeight: 700 }}
        >
          {!collapsed ? "FamilyHealth" : "FH"}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKey}
          items={[
            ...(hasPermission(user, "view_dashboard")
              ? [
                  {
                    key: "1",
                    label: React.createElement(Link, { to: "/" }, "Dashboard"),
                  },
                ]
              : []),
            ...(hasPermission(user, "view_records")
              ? [
                  {
                    key: "2",
                    label: React.createElement(
                      Link,
                      { to: "/records" },
                      "Hồ sơ"
                    ),
                  },
                ]
              : []),
            ...(hasPermission(user, "view_patients")
              ? [
                  {
                    key: "3",
                    label: React.createElement(
                      Link,
                      { to: "/patients" },
                      "Bệnh nhân"
                    ),
                  },
                ]
              : []),
            ...(hasPermission(user, "view_appointments")
              ? [
                  {
                    key: "4",
                    label: React.createElement(
                      Link,
                      { to: "/appointments" },
                      "Lịch hẹn"
                    ),
                  },
                ]
              : []),
            ...(hasPermission(user, "view_family") ||
            hasPermission(user, "view_records")
              ? [
                  {
                    key: "5",
                    label: React.createElement(
                      Link,
                      { to: "/family" },
                      "Gia đình"
                    ),
                  },
                ]
              : []),
            ...(hasPermission(user, "view_prescriptions")
              ? [
                  {
                    key: "6",
                    label: React.createElement(
                      Link,
                      { to: "/prescriptions" },
                      "Đơn thuốc"
                    ),
                  },
                ]
              : []),
            ...(hasPermission(user, "view_appointments")
              ? [
                  {
                    key: "7",
                    label: React.createElement(
                      Link,
                      { to: "/doctor/appointments" },
                      "Lịch bác sĩ"
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              icon={
                collapsed
                  ? React.createElement(MenuUnfoldOutlined)
                  : React.createElement(MenuFoldOutlined)
              }
            />
          </div>
          <div>
            <Space>
              <span>Xin chào, {user?.name || "Khách"}</span>
              <Dropdown menu={{ items: menu }} placement="bottomRight">
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
