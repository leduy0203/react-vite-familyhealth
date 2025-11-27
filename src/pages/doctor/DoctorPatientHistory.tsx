import React, { useEffect, useState } from "react";
import { Card, Timeline, Tag, Button, Row, Col, Descriptions, Space, Divider, Spin, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ClockCircleOutlined, UserOutlined, ArrowLeftOutlined, FileTextOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface MedicalResult {
  id: number;
  name: string;
  diagnose: string;
  note: string;
  totalMoney: number;
  createdAt: string;
  appointmentTime: string;
  doctorName: string;
}

interface PatientData {
  id: number;
  fullname: string;
  idCard: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  email: string | null;
  bhyt: string;
  medicalResults: MedicalResult[];
}

const genderMap: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };

const DoctorPatientHistory: React.FC = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberId) {
      loadPatientHistory();
    }
  }, [memberId]);

  const loadPatientHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/familyhealth/api/v1/members/members-medicalRecord/${memberId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load patient history');
      }

      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        setPatientData(data.data);
      } else {
        throw new Error(data.message || 'Failed to load patient history');
      }
    } catch (error) {
      console.error('Error loading patient history:', error);
      message.error('Không thể tải lịch sử bệnh án');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!patientData) {
    return (
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/doctor/patients")} style={{ marginBottom: 16 }}>
          Quay lại danh sách
        </Button>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            Không tìm thấy thông tin bệnh nhân
          </div>
        </Card>
      </div>
    );
  }

  const totalMoney = patientData.medicalResults.reduce((sum, item) => sum + item.totalMoney, 0);
  const totalVisits = patientData.medicalResults.length;

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/doctor/patients")} style={{ marginBottom: 16 }}>
        Quay lại danh sách
      </Button>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div style={{ marginTop: 8, fontSize: 24, fontWeight: 'bold' }}>
                {totalVisits}
              </div>
              <div style={{ color: '#8c8c8c' }}>Tổng số lần khám</div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <DollarOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <div style={{ marginTop: 8, fontSize: 24, fontWeight: 'bold' }}>
                {totalMoney.toLocaleString()}
              </div>
              <div style={{ color: '#8c8c8c' }}>Tổng chi phí (VND)</div>
            </div>
          </Card>
        </Col>
      </Row>

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
          <Descriptions.Item label="Họ tên">{patientData.fullname}</Descriptions.Item>
          <Descriptions.Item label="CCCD">{patientData.idCard}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {dayjs(patientData.dateOfBirth).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            <Tag color={patientData.gender === "MALE" ? "blue" : "pink"}>
              {genderMap[patientData.gender]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="BHYT">
            {patientData.bhyt || <Tag>Chưa có</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {patientData.email || <Tag>Chưa có</Tag>}
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
        extra={<Tag color="blue">{patientData.medicalResults.length} lần khám</Tag>}
      >
        {patientData.medicalResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#8c8c8c' }}>
            Chưa có lịch sử khám bệnh
          </div>
        ) : (
          <Timeline mode="left">
            {patientData.medicalResults.map((item) => (
              <Timeline.Item
                key={item.id}
                color="green"
                label={
                  <Space direction="vertical" size={0}>
                    <strong>{dayjs(item.appointmentTime).format('DD/MM/YYYY HH:mm')}</strong>
                  </Space>
                }
              >
                <Card size="small" style={{ marginBottom: 8 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Space>
                        <UserOutlined style={{ color: "#1890ff" }} />
                        <strong>Bác sĩ:</strong> {item.doctorName}
                      </Space>
                    </Col>
                    <Col span={24}>
                      <Space>
                        <FileTextOutlined style={{ color: "#1890ff" }} />
                        <strong>Chẩn đoán:</strong> {item.diagnose}
                      </Space>
                    </Col>
                    <Col span={24}>
                      <strong>Ghi chú:</strong> {item.note}
                    </Col>
                    <Col span={24}>
                      <Space>
                        <DollarOutlined style={{ color: "#52c41a" }} />
                        <strong>Tổng tiền:</strong>
                        <Tag color="green">{item.totalMoney.toLocaleString()} đ</Tag>
                      </Space>
                    </Col>
                    <Col span={24}>
                      <Divider style={{ margin: "8px 0" }} />
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        <ClockCircleOutlined /> Ngày tạo: {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default DoctorPatientHistory;
