import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Space,
  Button,
  Tag,
  Breadcrumb,
  Input,
  Select,
  Popconfirm,
  App,
  Typography,
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { userService, type IUserNew, type CreateUserDTO } from "../../../services/userService";
import UserFormModal from "../../../components/admin/users/UserFormModal";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const { message } = App.useApp();
  const [users, setUsers] = useState<IUserNew[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getList({
        page: currentPage - 1,
        size: pageSize,
      });
      setUsers(response.data.result);
      setTotal(response.data.meta.total);
    } catch (error: any) {
      message.error(error.message || "Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.delete(id);
      message.success("Thay đổi trạng thái thành công");
      fetchUsers(); // Reload
    } catch (error: any) {
      message.error(error.message || "Lỗi khi thay đổi trạng thái");
    }
  };

  const handleFinish = async (values: any) => {
    try {
      const createData: CreateUserDTO = {
        phone: values.phone,
        password: values.password,
        role_id: values.role_id,
        isActive: values.isActive,
      };
      await userService.create(createData);
      message.success("Thêm người dùng thành công");
      setModalOpen(false);
      fetchUsers(); // Reload
    } catch (error: any) {
      message.error(error.message || "Lỗi khi thêm người dùng");
    }
  };

  const getRoleTag = (roleName: string) => {
    if (roleName === "ADMIN") return <Tag color="red">ADMIN</Tag>;
    if (roleName === "DOCTOR") return <Tag color="blue">DOCTOR</Tag>;
    return <Tag color="green">PATIENT</Tag>;
  };

  const getStatusTag = (active: number) => {
    return active === 1 ? (
      <Tag color="success">Hoạt động</Tag>
    ) : (
      <Tag color="default">Khóa</Tag>
    );
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchText ||
      (user.fullName && user.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchText.toLowerCase())) ||
      user.phone.includes(searchText);
    
    const matchesRole = roleFilter === "all" || user.roleName === roleFilter;

    return matchesSearch && matchesRole;
  });

  const columns: ColumnsType<IUserNew> = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <Typography.Text strong>
          {text && text !== "N/A" ? text : <span style={{ color: "#999" }}>—</span>}
        </Typography.Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => text || <span style={{ color: "#999" }}>—</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      key: "roleName",
      align: "center",
      render: (roleName: string) => getRoleTag(roleName),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      align: "center",
      render: (active: number) => getStatusTag(active),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 120,
      render: (_: any, record: IUserNew) => (
        <Popconfirm
          title={record.active === 1 ? "Khóa người dùng?" : "Mở khóa người dùng?"}
          description={record.active === 1 ? "Người dùng sẽ không thể đăng nhập" : "Người dùng có thể đăng nhập lại"}
          onConfirm={() => handleDelete(record.id)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Button 
            danger={record.active === 1} 
            type={record.active === 1 ? "primary" : "default"}
            size="small" 
            icon={<DeleteOutlined />}
          >
            {record.active === 1 ? "Khóa" : "Mở"}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="users-page">
      {/* Breadcrumb */}
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <TeamOutlined />
                  <span>Quản lý người dùng</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Main Content */}
      <Card variant="borderless">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Space align="center">
            <TeamOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Quản lý Người dùng
            </Title>
          </Space>
        </div>

        {/* Filters and Actions */}
        <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Input
              placeholder="Tìm kiếm theo họ tên, email, SĐT..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              allowClear
            />
            <Select
              placeholder="Lọc theo vai trò"
              style={{ width: 150 }}
              value={roleFilter}
              onChange={setRoleFilter}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
              <Select.Option value="PATIENT">Patient</Select.Option>
            </Select>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm người dùng
          </Button>
        </Space>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} người dùng`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      {/* Modal */}
      <UserFormModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onFinish={handleFinish}
        loading={loading}
      />
    </div>
  );
};

export default UsersPage;
