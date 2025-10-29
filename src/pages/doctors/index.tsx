import React, { useEffect, useState } from "react";
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Empty,
  Input,
  List,
  Rate,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { api } from "../../config/api";
import type { IDoctor } from "../../types/health";
import "../../styles/doctors.scss";

const { Title, Text } = Typography;

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>();
  const { message } = App.useApp();

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await api.getDoctorsList();
        setDoctors(res.data);
      } catch (error) {
        message.error("Không thể tải danh sách bác sĩ");
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [message]);

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchSearch =
      !searchText ||
      doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchText.toLowerCase());

    const matchSpecialization =
      !selectedSpecialization || doc.specialization === selectedSpecialization;

    return matchSearch && matchSpecialization;
  });

  // Get unique specializations for filter
  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization))
  );

  const handleBookAppointment = (doctor: IDoctor) => {
    console.log("Book appointment with:", doctor.name);
    // TODO: Navigate to appointments page with doctor pre-selected
  };

  return (
    <div className="doctors-page">
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
                  <MedicineBoxOutlined />
                  <span>Danh sách bác sĩ</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Main Content Card */}
      <Card variant="borderless" className="content-card">
        {/* Header */}
        <div className="page-header">
          <div className="header-title">
            <MedicineBoxOutlined className="icon" />
            <Title level={5}>Danh sách Bác sĩ</Title>
          </div>

          {/* Filters */}
          <Space className="filters" wrap>
            <Input
              className="search-input"
              placeholder="Tìm kiếm theo tên bác sĩ, chuyên khoa, bệnh viện..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              className="specialization-select"
              placeholder="Chọn chuyên khoa"
              allowClear
              value={selectedSpecialization}
              onChange={setSelectedSpecialization}
            >
              {specializations.map((spec) => (
                <Select.Option key={spec} value={spec}>
                  {spec}
                </Select.Option>
              ))}
            </Select>
          </Space>

          <Text type="secondary">Tìm thấy {filteredDoctors.length} bác sĩ</Text>
        </div>

        {/* Doctor List */}
        <List
          loading={loading}
          dataSource={filteredDoctors}
          locale={{
            emptyText: (
              <Empty
                description="Không tìm thấy bác sĩ"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          pagination={{
            pageSize: 6,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} bác sĩ`,
          }}
          renderItem={(doctor) => (
            <List.Item className="doctor-list-item">
              <Card hoverable className="doctor-card">
                <div className="doctor-content">
                  {/* Avatar */}
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={doctor.avatar}
                    className="doctor-avatar"
                  />

                  {/* Doctor Information */}
                  <div className="doctor-info">
                    <Space direction="vertical" size={8} className="info-space">
                      {/* Name & Rating */}
                      <div className="doctor-header">
                        <div className="doctor-name-rating">
                          <Title level={5}>{doctor.name}</Title>
                          <div className="rating-container">
                            <Rate disabled allowHalf value={doctor.rating} />
                            <Text type="secondary" className="rating-text">
                              ({doctor.rating})
                            </Text>
                          </div>
                        </div>
                        <Tag color={doctor.available ? "green" : "red"}>
                          {doctor.available ? "Đang khám" : "Không khám"}
                        </Tag>
                      </div>

                      {/* Specialization & Experience */}
                      <div className="doctor-tags">
                        <Tag color="blue">{doctor.specialization}</Tag>
                        <Tag>{doctor.experience} năm kinh nghiệm</Tag>
                        {doctor.education && <Tag>{doctor.education}</Tag>}
                      </div>

                      {/* Contact Info */}
                      <div className="doctor-contact">
                        <div className="contact-item">
                          <EnvironmentOutlined className="icon hospital-icon" />
                          <Text>{doctor.hospital}</Text>
                        </div>
                        {doctor.address && (
                          <Text
                            type="secondary"
                            className="contact-item address"
                          >
                            <EnvironmentOutlined className="icon address-icon" />
                            {doctor.address}
                          </Text>
                        )}
                        {doctor.phone && (
                          <Text type="secondary" className="contact-item">
                            <PhoneOutlined className="icon phone-icon" />
                            {doctor.phone}
                          </Text>
                        )}
                        {doctor.email && (
                          <Text type="secondary" className="contact-item">
                            <MailOutlined className="icon email-icon" />
                            {doctor.email}
                          </Text>
                        )}
                      </div>

                      {/* Languages */}
                      {doctor.languages && doctor.languages.length > 0 && (
                        <div className="doctor-languages">
                          <Text type="secondary" className="languages-label">
                            Ngôn ngữ:{" "}
                          </Text>
                          {doctor.languages.map((lang) => (
                            <Tag key={lang}>{lang}</Tag>
                          ))}
                        </div>
                      )}
                    </Space>
                  </div>

                  {/* Action Buttons */}
                  <div className="doctor-actions">
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      onClick={() => handleBookAppointment(doctor)}
                      disabled={!doctor.available}
                      className="book-button"
                    >
                      Đặt lịch
                    </Button>
                    <Button type="default" icon={<UserOutlined />}>
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DoctorsPage;
