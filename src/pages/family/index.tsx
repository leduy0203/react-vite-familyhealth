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
  IdcardOutlined,
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { familyService, getRelationText, getGenderText, type IFamilyMemberNew } from "../../services/familyService";
import ViewMemberModal from "../../components/family/ViewMemberModal";
import EditMemberModal from "../../components/family/EditMemberModal";
import "../../styles/family.scss";

const { Title, Text } = Typography;

const FamilyPage: React.FC = () => {
  const { message } = App.useApp();

  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [members, setMembers] = useState<IFamilyMemberNew[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMember, setViewMember] = useState<IFamilyMemberNew | null>(null);
  const [editMember, setEditMember] = useState<IFamilyMemberNew | null>(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const response = await familyService.getList();
      setMembers(response.data.result);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setIsAdding(true);
      
      const payload = {
        fullname: values.fullname,
        idCard: values.idCard,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        relation: values.relation,
        bhyt: values.bhyt || null,
        address: values.address,
        email: values.email || null,
        user_account: values.createAccount ? {
          roleId: 3, // Patient role
          phone: values.phone,
          password: values.password,
        } : undefined,
      };

      await familyService.create(payload);
      message.success("Thêm thành viên thành công");
      form.resetFields();
      loadMembers();
    } catch (err: any) {
      if (err.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin");
      } else {
        message.error(err?.response?.data?.message || "Thêm thành viên thất bại");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleView = (member: IFamilyMemberNew) => {
    setViewMember(member);
  };

  const handleEdit = (member: IFamilyMemberNew) => {
    setEditMember(member);
  };

  const handleConfirmDelete = async (member: IFamilyMemberNew) => {
    try {
      await familyService.delete(member.id);
      message.success(`Đã xóa thành viên: ${member.fullname}`);
      loadMembers();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Xóa thành viên thất bại");
    }
  };

  // Filter members based on search
  const filteredMembers = members.filter((member) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      member.fullname?.toLowerCase().includes(search) ||
      member.idCard?.toLowerCase().includes(search) ||
      getRelationText(member.relation)?.toLowerCase().includes(search) ||
      member.address?.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
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
      title: "Số CCCD",
      dataIndex: "idCard",
      key: "idCard",
      render: (text: string) => (
        <Space>
          <IdcardOutlined style={{ color: "#1890ff" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (
        <Space>
          {gender === "MALE" ? (
            <ManOutlined style={{ color: "#1890ff" }} />
          ) : gender === "FEMALE" ? (
            <WomanOutlined style={{ color: "#eb2f96" }} />
          ) : null}
          <Text>{getGenderText(gender)}</Text>
        </Space>
      ),
    },
    {
      title: "Quan hệ",
      dataIndex: "relation",
      key: "relation",
      render: (relation: string) => (
        <Tag color={relation === "CHU_HO" ? "blue" : "default"}>
          {getRelationText(relation)}
        </Tag>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date: string) => (
        <Text>{date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}</Text>
      ),
    },
    {
      title: "Số BHYT",
      dataIndex: "bhyt",
      key: "bhyt",
      render: (text: string | null) => (
        <Text type={text ? undefined : "secondary"}>
          {text || "Chưa có"}
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      fixed: "right" as const,
      width: 150,
      render: (_: any, member: IFamilyMemberNew) => (
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
            title={`Xóa thành viên "${member.fullname}"?`}
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
        <Space align="center" className="form-header" style={{ marginBottom: 16 }}>
          <UserOutlined className="icon" style={{ fontSize: 18, color: "#1890ff" }} />
          <Title level={5} style={{ margin: 0 }}>Thêm thành viên mới</Title>
        </Space>

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {/* Thông tin cơ bản */}
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Họ và tên"
                name="fullname"
                rules={[
                  { required: true, message: "Nhập họ tên" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input placeholder="Nguyễn Văn A" prefix={<UserOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Số CCCD"
                name="idCard"
                rules={[
                  { required: true, message: "Nhập CCCD" },
                  { pattern: /^[0-9]{9,12}$/, message: "CCCD: 9-12 chữ số" },
                ]}
              >
                <Input placeholder="001234567890" prefix={<IdcardOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Chọn giới tính" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="MALE">
                    <Space><ManOutlined style={{ color: "#1890ff" }} />Nam</Space>
                  </Select.Option>
                  <Select.Option value="FEMALE">
                    <Space><WomanOutlined style={{ color: "#eb2f96" }} />Nữ</Space>
                  </Select.Option>
                  <Select.Option value="OTHER">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[{ required: true, message: "Chọn ngày sinh" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Quan hệ"
                name="relation"
                rules={[{ required: true, message: "Chọn quan hệ" }]}
              >
                <Select placeholder="Chọn quan hệ">
                  <Select.Option value="CHU_HO">Chủ hộ</Select.Option>
                  <Select.Option value="VO">Vợ</Select.Option>
                  <Select.Option value="CHONG">Chồng</Select.Option>
                  <Select.Option value="CON">Con</Select.Option>
                  <Select.Option value="BO">Bố</Select.Option>
                  <Select.Option value="ME">Mẹ</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Số BHYT (tùy chọn)"
                name="bhyt"
                rules={[
                  { pattern: /^[0-9]{10,15}$/, message: "BHYT: 10-15 chữ số" },
                ]}
              >
                <Input placeholder="0112345678" prefix={<IdcardOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Nhập địa chỉ" }]}
              >
                <Input placeholder="Số nhà, đường, phường/xã, quận/huyện" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Email (tùy chọn)"
                name="email"
                rules={[
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="email@example.com" prefix={<MailOutlined />} />
              </Form.Item>
            </Col>

            {/* Tạo tài khoản (tùy chọn) */}
            <Col span={24}>
              <Form.Item name="createAccount" valuePropName="checked">
                <Space>
                  <Input type="checkbox" style={{ width: 16, height: 16 }} />
                  <Text strong>Tạo tài khoản đăng nhập cho thành viên này</Text>
                </Space>
              </Form.Item>
            </Col>

            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.createAccount !== curr.createAccount}>
              {({ getFieldValue }) =>
                getFieldValue("createAccount") ? (
                  <>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                          { required: true, message: "Nhập SĐT" },
                          { pattern: /^[0-9]{10}$/, message: "SĐT: 10 chữ số" },
                        ]}
                      >
                        <Input placeholder="0912345678" prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                          { required: true, message: "Nhập mật khẩu" },
                          { min: 6, message: "Tối thiểu 6 ký tự" },
                        ]}
                      >
                        <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} />
                      </Form.Item>
                    </Col>
                  </>
                ) : null
              }
            </Form.Item>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                loading={isAdding}
              >
                Thêm thành viên
              </Button>
              <Button onClick={() => form.resetFields()}>
                Làm mới
              </Button>
            </Space>
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
            placeholder="Tìm kiếm theo tên, CCCD, quan hệ, địa chỉ..."
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
          scroll={{ x: 1200 }}
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
        onSuccess={loadMembers}
      />
    </div>
  );
};

export default FamilyPage;
