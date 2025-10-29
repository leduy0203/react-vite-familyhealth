import React, { useEffect, useState } from "react";
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchFamily } from "../../redux/slice/familySlice";
import type { IFamilyMember } from "../../types/health";
import ViewMemberModal from "../../components/family/ViewMemberModal";
import EditMemberModal from "../../components/family/EditMemberModal";
import "../../styles/family.scss";

const { Title, Text } = Typography;

const FamilyPage: React.FC = () => {
  const { message } = App.useApp();
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

  const getHealthStatusTag = (status?: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      "Khỏe mạnh": { color: "green", text: "Khỏe mạnh" },
      "Bình thường": { color: "cyan", text: "Bình thường" },
      "Đang điều trị": { color: "orange", text: "Đang điều trị" },
      "Cần theo dõi": { color: "gold", text: "Cần theo dõi" },
      "Nghiêm trọng": { color: "red", text: "Nghiêm trọng" },
    };
    if (!status) return <Tag color="default">Chưa có thông tin</Tag>;
    const config = statusConfig[status] || { color: "blue", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space className="name-cell">
          <UserOutlined className="icon" />
          <Text strong className="text">
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: "Quan hệ",
      dataIndex: "relation",
      key: "relation",
      render: (text: string) => (
        <Text className="relation-cell">{text || "Chưa xác định"}</Text>
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
      render: (status: string) => getHealthStatusTag(status),
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

  return (
    <div className="family-page">
      {/* Breadcrumb Card */}
      <Card variant="borderless" className="breadcrumb-card">
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
                  <span>Thành viên gia đình</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Form Card - Thêm thành viên */}
      <Card variant="borderless" className="form-card">
        <Space align="center" className="form-header">
          <UserOutlined className="icon" />
          <Title level={5}>Thêm thành viên mới</Title>
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
                <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
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
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  className="date-picker-full"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Tình trạng sức khỏe" name="healthStatus">
                <Select placeholder="-- Chọn tình trạng --">
                  <Select.Option value="Khỏe mạnh">Khỏe mạnh</Select.Option>
                  <Select.Option value="Bình thường">Bình thường</Select.Option>
                  <Select.Option value="Đang điều trị">
                    Đang điều trị
                  </Select.Option>
                  <Select.Option value="Cần theo dõi">
                    Cần theo dõi
                  </Select.Option>
                  <Select.Option value="Nghiêm trọng">
                    Nghiêm trọng
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="form-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="middle"
            >
              Thêm thành viên
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Table Card - Danh sách */}
      <Card variant="borderless" className="table-card">
        <div className="table-header">
          <Space align="center" className="header-title">
            <TeamOutlined className="icon" />
            <Title level={5}>Danh sách thành viên</Title>
          </Space>

          <Input
            className="search-input"
            placeholder="Tìm kiếm theo tên, quan hệ, tình trạng sức khỏe..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

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
              <div className="empty-state">
                <TeamOutlined className="icon" />
                <div className="text">Chưa có thành viên nào</div>
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
