import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Card,
  Descriptions,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Button,
  Empty,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import type { IDoctorNew } from "../../types/doctor.types";
import { EXPERTISE_LABELS, GENDER_LABELS } from "../../constants/expertise";
import { familyService, type IFamilyMemberNew } from "../../services/familyService";
import { appointmentService } from "../../services/appointmentService";
import axiosInstance from "../../config/axios";

const { TextArea } = Input;
const { Text } = Typography;

interface BookAppointmentModalProps {
  visible: boolean;
  doctor: IDoctorNew | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

interface DoctorDetailResponse {
  code: number;
  message: string;
  data: {
    id: number;
    fullname: string;
    dateOfBirth: string;
    idCard: string;
    address: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    email: string;
    expertise: string;
    bio: string;
  };
}

const relationMap: Record<string, string> = {
  CHU_HO: "Chủ hộ",
  VO: "Vợ",
  CHONG: "Chồng",
  CON: "Con",
};

// Mock data: Lịch khám của bác sĩ (available slots) - Giữ tạm thời cho đến khi có API
const mockDoctorSchedule = [
  {
    date: "2025-11-27",
    slots: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00"],
  },
  {
    date: "2025-11-28",
    slots: ["08:00", "08:30", "09:00", "10:00", "14:00", "15:00", "15:30", "16:00"],
  },
  {
    date: "2025-11-29",
    slots: ["08:00", "09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "16:00"],
  },
];

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  visible,
  doctor,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [members, setMembers] = useState<IFamilyMemberNew[]>([]);
  const [doctorDetail, setDoctorDetail] = useState<DoctorDetailResponse["data"] | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load family members khi mở modal
  useEffect(() => {
    if (visible) {
      loadFamilyMembers();
      if (doctor?.id) {
        loadDoctorDetail(doctor.id);
      }
    }
  }, [visible, doctor]);

  const loadFamilyMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await familyService.getList();
      if (response.code === 200) {
        setMembers(response.data.result);
      }
    } catch (error) {
      console.error("Error loading family members:", error);
      message.error("Đã có lỗi khi tải danh sách thành viên");
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadDoctorDetail = async (doctorId: number) => {
    setLoadingDoctor(true);
    try {
      const response = await axiosInstance.get<DoctorDetailResponse>(`/doctors/get/${doctorId}`);
      if (response.data.code === 200) {
        setDoctorDetail(response.data.data);
      }
    } catch (error) {
      console.error("Error loading doctor detail:", error);
      message.error("Đã có lỗi khi tải thông tin bác sĩ");
    } finally {
      setLoadingDoctor(false);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const schedule = mockDoctorSchedule.find((s) => s.date === dateStr);
    return schedule?.slots || [];
  };

  const availableSlots = getAvailableSlots();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedSlot) {
        message.error("Vui lòng chọn giờ khám!");
        return;
      }

      // Validate doctorId và memberId
      if (!doctor?.id) {
        message.error("Không tìm thấy thông tin bác sĩ!");
        return;
      }
      if (!values.memberId) {
        message.error("Vui lòng chọn người khám!");
        return;
      }

      setSubmitting(true);
      // Format time theo LocalDateTime của Java: yyyy-MM-ddTHH:mm:ss
      const appointmentDateTime = `${selectedDate?.format("YYYY-MM-DD")}T${selectedSlot}:00`;
      const appointmentData = {
        time: appointmentDateTime,
        location: doctorDetail?.address || doctor?.address || "",
        status: "SCHEDULED" as const,
        note: values.note || "",
        doctor_id: Number(doctor.id),
        member_id: Number(values.memberId),
      };

      console.log("📤 Sending appointment data:", appointmentData);

      try {
        const response = await appointmentService.create(appointmentData);
        if (response.code === 201) {
          message.success("Đặt lịch khám thành công!");
          form.resetFields();
          setSelectedDate(null);
          setSelectedSlot(null);
          onSubmit(appointmentData);
          onCancel();
        }
      } catch (error: any) {
        console.error("Error creating appointment:", error);
        console.log("📥 Error response:", error?.response?.data);
        const errorMsg = error?.response?.data?.message || "Đặt lịch thất bại";
        message.error(errorMsg);
      } finally {
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const disabledDate = (current: Dayjs) => {
    // Disable past dates and dates not in schedule
    if (current && current < dayjs().startOf("day")) {
      return true;
    }
    const dateStr = current.format("YYYY-MM-DD");
    return !mockDoctorSchedule.some((s) => s.date === dateStr);
  };

  return (
    <Modal
      open={visible}
      title={
        <div style={{ padding: "8px 0" }}>
          <Space style={{ fontSize: 18, fontWeight: 600 }}>
            <CalendarOutlined style={{ color: "#1890ff", fontSize: 20 }} />
            <span>Đặt lịch khám</span>
          </Space>
        </div>
      }
      onCancel={onCancel}
      onOk={handleSubmit}
      width={1000}
      okText="Đặt lịch"
      cancelText="Hủy"
      confirmLoading={submitting}
    >
      {doctor && (
        <>
          {/* Thông tin bác sĩ */}
          <Card
            size="small"
            title={
              <Space>
                <UserOutlined style={{ color: "#52c41a" }} />
                <span>Thông tin bác sĩ</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
            loading={loadingDoctor}
          >
            {doctorDetail && (
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Họ tên">{doctorDetail.fullname}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  <Tag color={doctorDetail.gender === "MALE" ? "blue" : "pink"}>
                    {GENDER_LABELS[doctorDetail.gender]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Chuyên khoa" span={2}>
                  <Tag color="blue">{EXPERTISE_LABELS[doctorDetail.expertise]}</Tag>
                </Descriptions.Item>
                {doctorDetail.address && (
                  <Descriptions.Item label="Địa chỉ" span={2}>
                    <Space>
                      <EnvironmentOutlined />
                      {doctorDetail.address}
                    </Space>
                  </Descriptions.Item>
                )}
                {doctorDetail.bio && (
                  <Descriptions.Item label="Giới thiệu" span={2}>
                    <Text type="secondary">{doctorDetail.bio}</Text>
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}
          </Card>

          {/* Form đặt lịch */}
          <Form form={form} layout="vertical">
            <Form.Item
              name="memberId"
              label="Chọn người khám"
              rules={[{ required: true, message: "Vui lòng chọn người khám!" }]}
            >
              <Select
                placeholder="Chọn thành viên gia đình"
                size="middle"
                showSearch
                optionFilterProp="children"
                loading={loadingMembers}
                notFoundContent={loadingMembers ? <Spin size="small" /> : <Empty description="Không có thành viên" />}
              >
                {members.map((member) => (
                  <Select.Option key={member.id} value={member.id}>
                    <Space>
                      <UserOutlined />
                      <strong>{member.fullname}</strong>
                      <Tag color="green">{relationMap[member.relation]}</Tag>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Chọn ngày khám" required>
              <DatePicker
                style={{ width: "100%" }}
                size="middle"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày khám"
                disabledDate={disabledDate}
                onChange={handleDateChange}
                value={selectedDate}
              />
            </Form.Item>

            {selectedDate && (
              <Form.Item
                label={
                  <Space>
                    <ClockCircleOutlined />
                    <span>Chọn giờ khám ({availableSlots.length} khung giờ khả dụng)</span>
                  </Space>
                }
                required
              >
                {availableSlots.length > 0 ? (
                  <Row gutter={[8, 8]}>
                    {availableSlots.map((slot) => (
                      <Col key={slot} span={6}>
                        <Button
                          type={selectedSlot === slot ? "primary" : "default"}
                          block
                          onClick={() => setSelectedSlot(slot)}
                          icon={<ClockCircleOutlined />}
                        >
                          {slot}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty description="Không có khung giờ khả dụng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Form.Item>
            )}

            <Form.Item name="note" label="Ghi chú (tùy chọn)">
              <TextArea
                rows={3}
                placeholder="Triệu chứng, lý do khám, hoặc thông tin bổ sung..."
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default BookAppointmentModal;
