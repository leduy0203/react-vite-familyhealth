import React from "react";
import { Card, Timeline, Tag, Button, Row, Col, Descriptions, Space, Divider } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ClockCircleOutlined, UserOutlined, ArrowLeftOutlined, FileTextOutlined, DollarOutlined } from "@ant-design/icons";

// Fake data: thông tin bệnh nhân
const mockPatient = {
  id: 1,
  fullname: "Nguyễn Văn A",
  id_card: "001234567890",
  address: "123 Lê Lợi, Q.1, TP.HCM",
  gender: "MALE",
  date_of_birth: "1990-01-01",
  email: "nguyenvana@gmail.com",
  bhyt: "123456789012",
  relation: "CHU_HO",
};

// Fake data: lịch sử khám bệnh của 1 bệnh nhân
const mockHistory = [
  {
    id: 1,
    appointment_date: "2025-11-01 09:00",
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "COMPLETED",
    diagnose: "Cảm cúm, viêm họng nhẹ",
    note: "Khám lần đầu, kê thuốc hạ sốt và kháng sinh. Tái khám sau 5 ngày.",
    total_money: 200000,
    result_name: "Kết quả khám tổng quát lần 1",
  },
  {
    id: 2,
    appointment_date: "2025-11-15 10:30",
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "COMPLETED",
    diagnose: "Viêm họng mạn tính",
    note: "Tái khám, kê thêm kháng sinh và thuốc xịt họng. Theo dõi thêm 1 tuần.",
    total_money: 350000,
    result_name: "Kết quả tái khám lần 2",
  },
  {
    id: 3,
    appointment_date: "2025-11-22 14:00",
    location: "Phòng khám Tim mạch - Tầng 2",
    status: "COMPLETED",
    diagnose: "Đã khỏi viêm họng, sức khỏe tốt",
    note: "Kiểm tra lại, bệnh nhân đã khỏi hoàn toàn. Tư vấn chế độ ăn uống.",
    total_money: 150000,
    result_name: "Kết quả tái khám cuối",
  },
];

const genderMap: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };
const relationMap: Record<string, string> = { CHU_HO: "Chủ hộ", VO: "Vợ", CHONG: "Chồng", CON: "Con" };
const statusMap: Record<string, { text: string; color: string }> = {
  SCHEDULED: { text: "Đã đặt", color: "blue" },
  COMPLETED: { text: "Hoàn thành", color: "green" },
  CANCELLED: { text: "Đã hủy", color: "red" },
};

const DoctorPatientHistory: React.FC = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  // Log memberId for debugging (can be used to fetch patient data from API)
  console.log("Patient ID:", memberId);

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/doctor/patients")} style={{ marginBottom: 16 }}>
        Quay lại danh sách
      </Button>

      <Card
        title={
          <Space style={{ fontSize: 20, fontWeight: 600 }}>
            <UserOutlined style={{ color: "#1890ff" }} />
            Thông tin bệnh nhân
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Họ tên">{mockPatient.fullname}</Descriptions.Item>
          <Descriptions.Item label="CCCD">{mockPatient.id_card}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{mockPatient.date_of_birth}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            <Tag color={mockPatient.gender === "MALE" ? "blue" : "pink"}>{genderMap[mockPatient.gender]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Quan hệ">
            <Tag color="green">{relationMap[mockPatient.relation]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="BHYT">{mockPatient.bhyt || <Tag>Chưa có</Tag>}</Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {mockPatient.email}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={3}>
            {mockPatient.address}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={
          <Space style={{ fontSize: 20, fontWeight: 600 }}>
            <ClockCircleOutlined style={{ color: "#52c41a" }} />
            Lịch sử khám bệnh
          </Space>
        }
        extra={<Tag color="blue">{mockHistory.length} lần khám</Tag>}
      >
        <Timeline mode="left">
          {mockHistory.map((item) => (
            <Timeline.Item
              key={item.id}
              color={statusMap[item.status].color}
              label={
                <Space direction="vertical" size={0}>
                  <strong>{item.appointment_date}</strong>
                  <Tag color={statusMap[item.status].color}>{statusMap[item.status].text}</Tag>
                </Space>
              }
            >
              <Card size="small" style={{ marginBottom: 8 }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Space>
                      <FileTextOutlined style={{ color: "#1890ff" }} />
                      <strong>Chẩn đoán:</strong> {item.diagnose}
                    </Space>
                  </Col>
                  <Col span={24}>
                    <strong>Địa điểm:</strong> {item.location}
                  </Col>
                  <Col span={24}>
                    <strong>Ghi chú:</strong> {item.note}
                  </Col>
                  <Col span={24}>
                    <Space>
                      <DollarOutlined style={{ color: "#52c41a" }} />
                      <strong>Tổng tiền:</strong>
                      <Tag color="green">{item.total_money.toLocaleString()} đ</Tag>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Divider style={{ margin: "8px 0" }} />
                    <Space>
                      <strong>Kết quả:</strong> {item.result_name}
                      <Button type="link" size="small" onClick={() => alert(`Xem chi tiết: ${item.result_name}`)}>
                        Xem chi tiết
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default DoctorPatientHistory;
