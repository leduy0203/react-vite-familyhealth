import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  ControlOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { FaStethoscope, FaHeartbeat } from "react-icons/fa";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLogoutAction } from "../../redux/slice/accountSlice";
import { authService } from "../../services/authService";
import "../../styles/layout.scss";
import { hasRole } from "../../config/permissions";

const { Header, Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.account.user);
  const location = useLocation();
  const selectedKey = React.useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/admin/dashboard")) return ["6"];
    if (p.startsWith("/admin/users")) return ["7"];
    if (p.startsWith("/admin/doctors")) return ["9"];
    if (p.startsWith("/appointments")) return ["2"];
    if (p.startsWith("/doctor/confirmed-appointments")) return ["12"];
    if (p.startsWith("/doctor/appointments")) return ["3"];
    if (p.startsWith("/doctor/patients")) return ["10"];
    if (p.startsWith("/doctor/patient-history")) return ["10"];
    if (p.startsWith("/doctor/medical-history")) return ["11"];
    if (p.startsWith("/family")) return ["4"];
    if (p.startsWith("/doctors")) return ["5"];
    if (p.startsWith("/history")) return ["8"];
    if (p.startsWith("/medical-records")) return ["13"];
    if (p.startsWith("/admin/households")) return ["14"];
    return ["1"];
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
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
    <Layout
      style={{ minHeight: "100vh", maxHeight: "100vh", overflow: "hidden" }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(v) => setCollapsed(v)}
        theme="light"
        width={280}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
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
          defaultOpenKeys={hasRole(user, "ADMIN") ? ["admin"] : []}
          items={[
            // Admin Menu - Chỉ hiển thị cho ADMIN
            ...(hasRole(user, "ADMIN")
              ? [
                  {
                    key: "admin",
                    icon: React.createElement(ControlOutlined),
                    label: "Quản trị",
                    children: [
                      {
                        key: "6",
                        icon: React.createElement(DashboardOutlined),
                        label: React.createElement(
                          Link,
                          { to: "/admin/dashboard" },
                          "Thống kê"
                        ),
                      },
                      {
                        key: "7",
                        icon: React.createElement(UsergroupAddOutlined),
                        label: React.createElement(
                          Link,
                          { to: "/admin/users" },
                          "Người dùng"
                        ),
                      },
                      {
                        key: "9",
                        icon: React.createElement(MedicineBoxOutlined),
                        label: React.createElement(
                          Link,
                          { to: "/admin/doctors" },
                          "Quản lý bác sĩ"
                        ),
                      },
                      {
                        key: "14",
                        icon: React.createElement(HomeOutlined),
                        label: React.createElement(
                          Link,
                          { to: "/admin/households" },
                          "Hộ gia đình"
                        ),
                      },
                    ],
                  },
                ]
              : []),

            // Doctor Menu - Chỉ hiển thị cho DOCTOR
            ...(hasRole(user, "DOCTOR")
              ? [
                  {
                    key: "3",
                    icon: React.createElement(ScheduleOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/doctor/appointments" },
                      "Lịch hẹn"
                    ),
                  },
                  {
                    key: "12",
                    icon: React.createElement(FaStethoscope),
                    label: React.createElement(
                      Link,
                      { to: "/doctor/confirmed-appointments" },
                      "Khám bệnh"
                    ),
                  },
                  {
                    key: "10",
                    icon: React.createElement(UsergroupAddOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/doctor/patients" },
                      "Danh sách bệnh nhân"
                    ),
                  },
                  {
                    key: "11",
                    icon: React.createElement(HistoryOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/doctor/medical-history" },
                      "Lịch sử khám bệnh"
                    ),
                  },
                ]
              : []),

            // Patient Menu - Hiển thị cho PATIENT và PATIENT_HOUSEHOLD
            ...(hasRole(user, ["PATIENT", "PATIENT_HOUSEHOLD"])
              ? [
                  {
                    key: "1",
                    icon: React.createElement(DashboardOutlined),
                    label: React.createElement(Link, { to: "/" }, "Trang chủ"),
                  },
                  {
                    key: "4",
                    icon: React.createElement(HomeOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/family" },
                      "Thành viên"
                    ),
                  },
                  {
                    key: "2",
                    icon: React.createElement(ScheduleOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/appointments" },
                      "Lịch hẹn"
                    ),
                  },
                  {
                    key: "5",
                    icon: React.createElement(MedicineBoxOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/doctors" },
                      "Danh sách bác sĩ"
                    ),
                  },
                  {
                    key: "8",
                    icon: React.createElement(HistoryOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/history" },
                      "Kết quả khám"
                    ),
                  },
                  {
                    key: "13",
                    icon: React.createElement(FileTextOutlined),
                    label: React.createElement(
                      Link,
                      { to: "/medical-records" },
                      "Hồ sơ bệnh án"
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            height: 80,
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            top: 0,
            right: 0,
            left: collapsed ? 80 : 280,
            zIndex: 1,
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
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
        <Content
          style={{
            marginTop: 80,
            padding: "15px",
            minHeight: "calc(100vh - 80px)",
            maxHeight: "calc(100vh - 80px)",
            overflow: "auto",
            background: "#f0f2f5",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
