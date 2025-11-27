import React, { useEffect, useState } from "react";
import { 
  Card, 
  Spin, 
  Row, 
  Col, 
  Statistic, 
  Calendar,
  Badge,
  List,
  Avatar,
  Button,
  FloatButton,
  Modal,
  Input,
  Empty,
  Tag
} from "antd";
import { 
  CalendarOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SendOutlined,
  RobotOutlined
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAppointments } from "../../redux/slice/appointmentSlice";
import type { IAppointment } from "../../types/health";
import dayjs, { Dayjs } from "dayjs";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: appointments, loading } = useAppSelector((s) => s.appointment);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ 
    type: 'user' | 'bot', 
    content: string,
    doctors?: Array<{
      doctorId: number;
      fullname: string;
      expertise: string;
      bio: string;
      matchScore: number;
    }>,
    severity?: string,
    requiresDoctor?: boolean
  }>>([
    { type: 'bot', content: 'Xin chào! Tôi là trợ lý ảo của Family Health. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Load appointments
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Statistics
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = apt.time || apt.appointmentDate;
    return aptDate && dayjs(aptDate).isAfter(dayjs()) && apt.status !== 'CANCELLED';
  }).length;
  const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED').length;
  
  // Today's appointments
  const todayAppointments = appointments.filter(apt => {
    const aptDate = apt.time || apt.appointmentDate;
    return aptDate && dayjs(aptDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
  });

  // Upcoming appointments (next 7 days)
  const next7Days = appointments.filter(apt => {
    const aptDate = apt.time || apt.appointmentDate;
    if (!aptDate || apt.status === 'CANCELLED') return false;
    const daysDiff = dayjs(aptDate).diff(dayjs(), 'day');
    return daysDiff >= 0 && daysDiff <= 7;
  }).slice(0, 5);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMsg }]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('http://localhost:8080/familyhealth/api/v1/ai/consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
        },
        body: JSON.stringify({ symptoms: userMsg })
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: data.data.advice,
          doctors: data.data.recommendedDoctors || [],
          severity: data.data.severity,
          requiresDoctor: data.data.requiresDoctor
        }]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau hoặc liên hệ trực tiếp với bác sĩ nếu khẩn cấp.' 
      }]);
    } finally {
      setIsSending(false);
    }
  };



  const getAppointmentsForDate = (date: Dayjs) => {
    return appointments.filter(apt => {
      const aptDate = apt.time || apt.appointmentDate;
      return aptDate && dayjs(aptDate).format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });
  };

  const dateCellRender = (date: Dayjs) => {
    const dayAppointments = getAppointmentsForDate(date);
    if (dayAppointments.length === 0) return null;

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayAppointments.slice(0, 2).map(apt => (
          <li key={apt.id}>
            <Badge status={apt.status === 'CONFIRMED' ? 'success' : 'processing'} text="" />
          </li>
        ))}
        {dayAppointments.length > 2 && (
          <li style={{ fontSize: 12, color: '#1890ff' }}>+{dayAppointments.length - 2} lịch khác</li>
        )}
      </ul>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header Card */}
      <Card style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Trang chủ</h1>
        <p style={{ color: "#666", margin: 0 }}>
          Tổng quan sức khỏe gia đình và lịch hẹn
        </p>
      </Card>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn"
              value={totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lịch sắp tới"
              value={upcomingAppointments}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={completedAppointments}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hôm nay"
              value={todayAppointments.length}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Calendar */}
        <Col xs={24} lg={16}>
          <Card title="Lịch hẹn" style={{ marginBottom: 16 }}>
            <Calendar
              fullscreen={false}
              cellRender={dateCellRender}
            />
          </Card>
        </Col>

        {/* Upcoming Appointments */}
        <Col xs={24} lg={8}>
          <Card 
            title="Lịch hẹn sắp tới" 
            style={{ marginBottom: 16 }}
            extra={
              <Button type="link" href="/appointments" icon={<CalendarOutlined />}>
                Xem tất cả
              </Button>
            }
          >
            {next7Days.length > 0 ? (
              <List
                dataSource={next7Days}
                renderItem={(apt: IAppointment) => {
                  const aptDate = apt.time || apt.appointmentDate;
                  const doctorName = apt.doctor?.fullName || apt.doctorName || 'Chưa xác định';
                  const patientName = apt.member?.fullName || apt.patientName || 'Chưa xác định';
                  
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div>
                            <Tag color={apt.status === 'CONFIRMED' ? 'green' : 'blue'}>
                              {apt.status}
                            </Tag>
                            {doctorName}
                          </div>
                        }
                        description={
                          <div>
                            <div><strong>Bệnh nhân:</strong> {patientName}</div>
                            <div><strong>Thời gian:</strong> {dayjs(aptDate).format('DD/MM/YYYY HH:mm')}</div>
                            <div><strong>Địa điểm:</strong> {apt.location || 'Chưa xác định'}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty description="Không có lịch hẹn sắp tới" />
            )}
          </Card>

          {/* Quick Actions */}
          <Card title="Thao tác nhanh">
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              block
              style={{ marginBottom: 8 }}
              href="/appointments"
            >
              Đặt lịch khám
            </Button>
            <Button
              icon={<HistoryOutlined />}
              block
              style={{ marginBottom: 8 }}
              href="/history"
            >
              Lịch sử khám bệnh
            </Button>
            <Button
              icon={<MedicineBoxOutlined />}
              block
              href="/doctors"
            >
              Tìm bác sĩ
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Chatbot FloatButton */}
      <FloatButton
        icon={<RobotOutlined style={{ fontSize: 24 }} />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 60, height: 60 }}
        onClick={() => setChatbotOpen(true)}
        tooltip="Trợ lý ảo"
      />

      {/* Chatbot Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RobotOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <span>Trợ lý ảo Family Health</span>
          </div>
        }
        open={chatbotOpen}
        onCancel={() => setChatbotOpen(false)}
        footer={null}
        width={650}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: 600 }}>
          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: 16, 
            backgroundColor: '#f5f5f5' 
          }}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                {/* Message bubble */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: 12
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      backgroundColor: msg.type === 'user' ? '#1890ff' : '#fff',
                      color: msg.type === 'user' ? '#fff' : '#000',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Doctor recommendations */}
                {msg.doctors && msg.doctors.length > 0 && (
                  <div style={{ marginBottom: 12, paddingLeft: 8 }}>
                    <div style={{ 
                      fontSize: 12, 
                      color: '#666', 
                      marginBottom: 8,
                      fontWeight: 500
                    }}>
                      🏥 Bác sĩ được đề xuất:
                    </div>
                    {msg.doctors.map(doctor => (
                      <Card 
                        key={doctor.doctorId}
                        size="small"
                        style={{ 
                          marginBottom: 8,
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Avatar 
                            size={40}
                            icon={<UserOutlined />} 
                            style={{ backgroundColor: '#1890ff' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>
                              {doctor.fullname}
                            </div>
                            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                              <Tag color="blue" style={{ margin: 0 }}>
                                {doctor.expertise}
                              </Tag>
                            </div>
                            <div style={{ fontSize: 11, color: '#999' }}>
                              Độ phù hợp: {(doctor.matchScore * 100).toFixed(0)}%
                            </div>
                          </div>
                          <Button 
                            type="primary" 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = '/doctors';
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Severity warning */}
                {msg.severity === 'HIGH' && msg.requiresDoctor && (
                  <div style={{ 
                    marginBottom: 12, 
                    paddingLeft: 8,
                    padding: 12,
                    backgroundColor: '#fff2e8',
                    border: '1px solid #ffbb96',
                    borderRadius: 8
                  }}>
                    <div style={{ 
                      color: '#d4380d', 
                      fontWeight: 600,
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      ⚠️ Cảnh báo khẩn cấp
                    </div>
                    <div style={{ fontSize: 12, color: '#ad4e00' }}>
                      Triệu chứng của bạn có thể nghiêm trọng. Vui lòng đặt lịch khám ngay hoặc đến cơ sở y tế gần nhất.
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
                <div style={{ 
                  padding: '8px 12px', 
                  borderRadius: 8, 
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  <Spin size="small" /> Đang trả lời...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ 
            padding: 16, 
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fff'
          }}>
            <Input
              placeholder="Nhập câu hỏi của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={handleSendMessage}
              suffix={
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isSending}
                  size="small"
                />
              }
              disabled={isSending}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
