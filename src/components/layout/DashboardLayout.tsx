import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SolutionOutlined,
  TeamOutlined,
  ScheduleOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { FaStethoscope, FaHeartbeat } from "react-icons/fa";
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
        width={280}
      >
        <div
          className="logo"
          style={{
            padding: "24px 16px 20px 16px",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <FaHeartbeat style={{ color: "#ff4d4f", fontSize: 28 }} />
          {!collapsed && "FamilyHealth"}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKey}
          style={{ fontSize: 17 }}
          items={[
            ...(hasPermission(user, "view_dashboard")
              ? [
                  {
                    key: "1",
                    icon: React.createElement(DashboardOutlined),
                    label: React.createElement(Link, { to: "/" }, "Dashboard"),
                  },
                ]
              : []),
            ...(hasPermission(user, "view_records")
              ? [
                  {
                    key: "2",
                    icon: React.createElement(SolutionOutlined),
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
                    icon: React.createElement(TeamOutlined),
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
                    icon: React.createElement(ScheduleOutlined),
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
                    icon: React.createElement(HomeOutlined),
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
                    icon: React.createElement(FileTextOutlined),
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
                    icon: React.createElement(FaStethoscope),
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
            height: 80,
            padding: "0 24px",
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
                  size={40}
                  style={{ backgroundColor: "#87d068", cursor: "pointer" }}
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
