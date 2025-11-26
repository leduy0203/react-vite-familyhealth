import React, { useEffect, useState, useCallback } from "react";
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Empty,
  Input,
  List,
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
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { doctorService } from "../../services/doctorService";
import { EXPERTISE_LABELS, GENDER_LABELS } from "../../constants/expertise";
import type { IDoctorNew, DoctorListMeta } from "../../types/doctor.types";
import BookAppointmentModal from "../../components/doctors/BookAppointmentModal";
import { useAppDispatch } from "../../redux/hooks";
import { fetchAppointments } from "../../redux/slice/appointmentSlice";
import "../../styles/doctors.scss";

const { Title, Text } = Typography;

const DoctorsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [doctors, setDoctors] = useState<IDoctorNew[]>([]);
  const [meta, setMeta] = useState<DoctorListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctorNew | null>(null);
  const { message } = App.useApp();

  // Fetch doctors from API
  const fetchDoctors = useCallback(
    async (page = 0, pageSize = 20, search?: string) => {
      setLoading(true);
      try {
        const response = await doctorService.getList({
          page,
          pageSize,
          search,
        });
        setDoctors(response.data.result);
        setMeta(response.data.meta);
      } catch (error) {
        message.error("Không thể tải danh sách bác sĩ");
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    },
    [message]
  );

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Filter doctors locally (by expertise only, search is done on server)
  const filteredDoctors = doctors.filter((doc) => {
    const matchExpertise =
      !selectedExpertise || doc.expertise === selectedExpertise;
    return matchExpertise;
  });

  // Get unique expertises for filter
  const expertises = Array.from(new Set(doctors.map((d) => d.expertise)));

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchDoctors(0, 20, value || undefined);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchDoctors(page - 1, pageSize, searchText || undefined);
  };

  const handleBookAppointment = (doctor: IDoctorNew) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
  };

  const handleAppointmentSubmit = (values: any) => {
    console.log("Booking appointment:", values);
    // Reload appointments sau khi đặt lịch thành công
    dispatch(fetchAppointments());
    handleModalClose();
    // TODO: Call API to create appointment
  };

  const getAgeFromDOB = (dob?: string | null): number | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
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
            <Input.Search
              className="search-input"
              placeholder="Tìm kiếm theo tên bác sĩ..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              allowClear
              enterButton
              style={{ minWidth: 300 }}
            />
            <Select
              className="specialization-select"
              placeholder="Chọn chuyên khoa"
              allowClear
              value={selectedExpertise}
              onChange={setSelectedExpertise}
              style={{ minWidth: 200 }}
            >
              {expertises.map((exp) => (
                <Select.Option key={exp} value={exp}>
                  {EXPERTISE_LABELS[exp] || exp}
                </Select.Option>
              ))}
            </Select>
          </Space>

          <Text type="secondary">Tìm thấy {meta?.total || 0} bác sĩ</Text>
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
            current: (meta?.page || 0) + 1,
            pageSize: meta?.pageSize || 20,
            total: meta?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bác sĩ`,
            onChange: handlePageChange,
            pageSizeOptions: ["10", "20", "50"],
          }}
          renderItem={(doctor) => (
            <List.Item className="doctor-list-item">
              <Card hoverable className="doctor-card">
                <div className="doctor-content">
                  {/* Avatar */}
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    className="doctor-avatar"
                  />

                  {/* Doctor Information */}
                  <div className="doctor-info">
                    <Space direction="vertical" size={8} className="info-space">
                      {/* Name & Gender */}
                      <div className="doctor-header">
                        <div className="doctor-name-rating">
                          <Title level={5}>{doctor.fullname}</Title>
                          <Tag
                            color={doctor.gender === "MALE" ? "blue" : "pink"}
                          >
                            {GENDER_LABELS[doctor.gender]}
                          </Tag>
                        </div>
                      </div>

                      {/* Expertise & Age */}
                      <div className="doctor-tags">
                        <Tag color="blue">
                          {EXPERTISE_LABELS[doctor.expertise] ||
                            doctor.expertise}
                        </Tag>
                        {doctor.dateOfBirth && (
                          <Tag>
                            {getAgeFromDOB(doctor.dateOfBirth)} tuổi
                          </Tag>
                        )}
                      </div>

                      {/* Bio */}
                      {doctor.bio && (
                        <Text type="secondary" className="doctor-bio">
                          {doctor.bio}
                        </Text>
                      )}

                      {/* Contact Info */}
                      <div className="doctor-contact">
                        {doctor.address && (
                          <div className="contact-item">
                            <EnvironmentOutlined className="icon" />
                            <Text>{doctor.address}</Text>
                          </div>
                        )}
                        {doctor.email && (
                          <div className="contact-item">
                            <MailOutlined className="icon" />
                            <Text type="secondary">{doctor.email}</Text>
                          </div>
                        )}
                      </div>
                    </Space>
                  </div>

                  {/* Action Buttons */}
                  <div className="doctor-actions">
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      onClick={() => handleBookAppointment(doctor)}
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

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        visible={modalVisible}
        doctor={selectedDoctor}
        onCancel={handleModalClose}
        onSubmit={handleAppointmentSubmit}
      />
    </div>
  );
};

export default DoctorsPage;
