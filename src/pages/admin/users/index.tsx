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
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  type ISystemUser,
} from "../../../redux/slice/userSlice";
import UserFormModal from "../../../components/admin/users/UserFormModal";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ISystemUser | null>(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: ISystemUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      message.success("Xóa user thành công");
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const handleSave = async (userData: Partial<ISystemUser>) => {
    if (selectedUser) {
      await dispatch(updateUser({ ...selectedUser, ...userData } as ISystemUser)).unwrap();
    } else {
      await dispatch(createUser(userData)).unwrap();
    }
  };

  const getRoleTag = (role: { id: string; name: string }) => {
    const colors: Record<string, string> = {
      admin: "red",
      doctor: "blue",
      user: "green",
    };
    return <Tag color={colors[role.id] || "default"}>{role.name}</Tag>;
  };

  const getStatusTag = (status: string) => {
    return status === "active" ? (
      <Tag color="success">Hoạt động</Tag>
    ) : (
      <Tag color="default">Không hoạt động</Tag>
    );
  };

  // Filter users
  const filteredUsers = list.filter((user) => {
    const matchesSearch =
      !searchText ||
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role.id === roleFilter;

    return matchesSearch && matchesRole;
  });

  const columns: ColumnsType<ISystemUser> = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => text || "—",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role: { id: string; name: string }) => getRoleTag(role),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 150,
      render: (_: any, record: ISystemUser) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            description="Bạn có chắc muốn xóa user này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
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
              placeholder="Tìm kiếm theo tên, email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Lọc theo vai trò"
              style={{ width: 150 }}
              value={roleFilter}
              onChange={setRoleFilter}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="doctor">Bác sĩ</Select.Option>
              <Select.Option value="user">Người dùng</Select.Option>
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
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} người dùng`,
          }}
        />
      </Card>

      {/* Modal */}
      <UserFormModal
        open={modalOpen}
        user={selectedUser}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default UsersPage;
