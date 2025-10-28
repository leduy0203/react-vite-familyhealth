import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Tooltip,
  Breadcrumb,
  Input,
  Form,
  DatePicker,
  Select,
  App,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchFamily } from "../../redux/slice/familySlice";
import type { IFamilyMember } from "../../types/health";
import ViewMemberModal from "../../components/family/ViewMemberModal";
import EditMemberModal from "../../components/family/EditMemberModal";

const { Title, Text } = Typography;

const FamilyPage: React.FC = () => {
  const { message, modal } = App.useApp();
  const dispatch = useAppDispatch();
  const { members, loading } = useAppSelector((s) => s.family);

  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [viewMember, setViewMember] = useState<IFamilyMember | null>(null);
  const [editMember, setEditMember] = useState<IFamilyMember | null>(null);

  useEffect(() => {
    dispatch(fetchFamily());
  }, [dispatch]);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      console.log("Add member:", values);
      // TODO: Call API to add member
      message.success("Thêm thành viên thành công");
      form.resetFields();
      dispatch(fetchFamily());
    } catch (err) {
      console.error("Validation failed:", err);
      message.error(
        "Thêm thành viên thất bại, vui lòng kiểm tra lại thông tin"
      );
    }
  };

  const handleView = (member: IFamilyMember) => {
    setViewMember(member);
  };

  const handleEdit = (member: IFamilyMember) => {
    setEditMember(member);
  };

  const handleConfirmDelete = async (member: IFamilyMember) => {
    try {
      // TODO: Call API to delete member
      console.log("Delete member:", member.id);
      message.success(`Đã xóa thành viên: ${member.name}`);
      dispatch(fetchFamily());
    } catch (err) {
      message.error("Xóa thành viên thất bại");
    }
  };

  // Filter members based on search
  const filteredMembers = members.filter((member) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      member.name?.toLowerCase().includes(search) ||
      member.relation?.toLowerCase().includes(search) ||
      member.healthStatus?.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Quan hệ",
      dataIndex: "relation",
      key: "relation",
      render: (text: string) => (
        <Text style={{ color: "#595959" }}>{text || "Chưa xác định"}</Text>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => (
        <Text>{date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}</Text>
      ),
    },
    {
      title: "Tình trạng sức khỏe",
      dataIndex: "healthStatus",
      key: "healthStatus",
      ellipsis: true,
      render: (text: string) => (
        <Text style={{ color: "#595959" }}>{text || "Chưa có thông tin"}</Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, member: IFamilyMember) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(member)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(member)}
            />
          </Tooltip>
          <Popconfirm
            title={`Xóa thành viên "${member.name}"?`}
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleConfirmDelete(member)}
            okText="Xóa"
            cancelText="Hủy"
            placement="leftTop"
          >
            <Tooltip title="Xóa">
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- Style Objects (Giúp JSX gọn hơn) ---
  const cardStyle: React.CSSProperties = {
    marginBottom: 16,
    borderRadius: "8px",
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
  };

  const breadcrumbCardStyle: React.CSSProperties = {
    ...cardStyle,
    // Hơi khác một chút
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
  };

  const tableCardStyle: React.CSSProperties = {
    ...cardStyle,
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
  };
  // ----------------------------------------

  return (
    <div>
      {/* Breadcrumb Card */}
      <Card
        variant="borderless"
        style={cardStyle}
        styles={{ body: { padding: "12px 24px" } }}
      >
        <Breadcrumb
          style={{ fontSize: "15px" }}
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined style={{ fontSize: "16px" }} />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <TeamOutlined style={{ fontSize: "16px" }} />
                  <span>Thành viên gia đình</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Form Card - Thêm thành viên */}
      <Card
        variant="borderless"
        style={{
          marginBottom: 16,
          borderRadius: "8px",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        }}
      >
        <Space align="center" style={{ marginBottom: 16 }}>
          <UserOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
          <Title level={5} style={{ margin: 0 }}>
            Thêm thành viên mới
          </Title>
        </Space>

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập họ tên" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input
                  placeholder="Nhập họ và tên"
                  prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label="Quan hệ"
                name="relation"
                rules={[{ required: true, message: "Vui lòng chọn quan hệ" }]}
              >
                <Select placeholder="-- Chọn quan hệ --">
                  <Select.Option value="Cha">Cha</Select.Option>
                  <Select.Option value="Mẹ">Mẹ</Select.Option>
                  <Select.Option value="Con">Con</Select.Option>
                  <Select.Option value="Anh/Chị/Em">Anh/Chị/Em</Select.Option>
                  <Select.Option value="Vợ/Chồng">Vợ/Chồng</Select.Option>
                  <Select.Option value="Ông/Bà">Ông/Bà</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Ngày sinh" name="dob">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Tình trạng sức khỏe" name="healthStatus">
                <Input placeholder="Ví dụ: Khỏe mạnh, Đang điều trị..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="middle"
              style={{ borderRadius: "6px" }}
            >
              Thêm thành viên
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Table Card - Danh sách */}
      <Card
        variant="borderless"
        style={{
          marginBottom: 16,
          borderRadius: "8px",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Space align="center" style={{ marginBottom: 12 }}>
            <TeamOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <Title level={5} style={{ margin: 0 }}>
              Danh sách thành viên
            </Title>
          </Space>
        </div>

        {/* Search - Moved below title */}
        <Input
          placeholder="Tìm kiếm theo tên, quan hệ, tình trạng sức khỏe..."
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
          style={{ maxWidth: 400, marginBottom: 16 }}
        />

        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredMembers}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} thành viên`,
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "40px 0" }}>
                <TeamOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
                <div style={{ marginTop: "16px", color: "#8c8c8c" }}>
                  Chưa có thành viên nào
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* View Member Modal */}
      <ViewMemberModal
        open={!!viewMember}
        member={viewMember}
        onClose={() => setViewMember(null)}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        open={!!editMember}
        member={editMember}
        onClose={() => setEditMember(null)}
        onSuccess={() => dispatch(fetchFamily())}
      />
    </div>
  );
};

export default FamilyPage;
