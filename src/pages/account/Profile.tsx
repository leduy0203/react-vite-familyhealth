import React, { useEffect, useState } from "react";
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
import {
  CameraOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProfile, saveProfile } from "../../redux/slice/profileSlice";
import dayjs from "dayjs";
import "../../styles/profile.scss";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.profile.profile);
  const loading = useAppSelector((s) => s.profile.loading);
  const user = useAppSelector((s) => s.account.user);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const formData = {
        ...profile,
        dob: profile.dob ? dayjs(profile.dob) : undefined,
      };
      form.setFieldsValue(formData);
    }
  }, [profile, form]);

  const onFinish = async (values: any) => {
    try {
      const submitData = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : undefined,
      };
      await dispatch(saveProfile(submitData)).unwrap();
      message.success("Cập nhật thông tin thành công!");
    } catch (err) {
      message.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleUpload = (info: any) => {
    setFileList(info.fileList);
    if (info.file.status === "done") {
      message.success("Tải ảnh đại diện thành công!");
    }
  };

  return (
    <div className="profile-page">
      {/* Breadcrumb */}
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
                  <UserOutlined />
                  <span>Tài khoản</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Main Content */}
      <Row gutter={16}>
        {/* Left Column - Account Info */}
        <Col xs={24} lg={8}>
          <Card>
            <div className="avatar-section">
              <Upload
                fileList={fileList}
                onChange={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <div className="avatar-wrapper">
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    className="user-avatar"
                  />
                  <div className="camera-button">
                    <CameraOutlined className="camera-icon" />
                  </div>
                </div>
              </Upload>

              <div className="user-info">
                <Title level={4} className="user-name">
                  {user?.name || "Người dùng"}
                </Title>
                <Text type="secondary" className="user-email">
                  <MailOutlined /> {user?.email || "email@example.com"}
                </Text>
                <div className="user-role">
                  <Tag color="blue">{user?.role?.name || "User"}</Tag>
                </div>
              </div>
            </div>

            <Divider />

            {/* Account Info */}
            <div className="account-info-section">
              <Text strong className="section-title">
                Thông tin tài khoản
              </Text>
              <div className="info-list">
                <Row gutter={[0, 12]}>
                  <Col span={24}>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">
                        Email
                      </Text>
                      <div>
                        <Text strong className="info-value">
                          {user?.email || "N/A"}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">
                        Vai trò
                      </Text>
                      <div>
                        <Text strong className="info-value">
                          {user?.role?.name || "N/A"}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text type="secondary" className="info-label">
                        Trạng thái
                      </Text>
                      <div>
                        <Tag color="green">Đang hoạt động</Tag>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column - Personal Info Form */}
        <Col xs={24} lg={16}>
          <Card
            title={<Title level={5}>Thông tin cá nhân</Title>}
            className="profile-form-card"
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                      { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Nhập họ và tên"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại phải có 10 chữ số",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="0123456789"
                      prefix={<PhoneOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label="Giới tính" name="gender">
                    <Select size="large" placeholder="Chọn giới tính">
                      <Select.Option value="male">Nam</Select.Option>
                      <Select.Option value="female">Nữ</Select.Option>
                      <Select.Option value="other">Khác</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label="Ngày sinh" name="dob">
                    <DatePicker
                      size="large"
                      placeholder="Chọn ngày sinh"
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label="Nhóm máu" name="bloodType">
                    <Select size="large" placeholder="Chọn nhóm máu">
                      <Select.Option value="A">A</Select.Option>
                      <Select.Option value="B">B</Select.Option>
                      <Select.Option value="AB">AB</Select.Option>
                      <Select.Option value="O">O</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input.TextArea
                      size="large"
                      placeholder="Nhập địa chỉ đầy đủ"
                      rows={3}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Actions */}
              <Form.Item className="form-actions">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    icon={<SaveOutlined />}
                  >
                    Lưu thay đổi
                  </Button>
                  <Button size="large" onClick={() => form.resetFields()}>
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
