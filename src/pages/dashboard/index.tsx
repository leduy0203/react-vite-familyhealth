import React, { useEffect, useState } from "react";
import { 
  Card, 
  Breadcrumb, 
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
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot', content: string }>>([
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

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botResponse = generateBotResponse(userMsg);
      setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
      setIsSending(false);
    }, 1000);
  };

  const generateBotResponse = (message: string): string => {
    const msg = message.toLowerCase();
    
    if (msg.includes('đặt lịch') || msg.includes('hẹn')) {
      return 'Để đặt lịch khám, bạn vui lòng vào mục "Lịch hẹn" và chọn "Đặt lịch mới". Bạn có thể chọn bác sĩ, thời gian và lý do khám.';
    } else if (msg.includes('kết quả') || msg.includes('khám')) {
      return 'Bạn có thể xem kết quả khám bệnh tại mục "Lịch sử khám bệnh". Tất cả kết quả đã hoàn thành sẽ được lưu trữ ở đó.';
    } else if (msg.includes('gia đình')) {
      return 'Bạn có thể quản lý thành viên gia đình tại mục "Quản lý gia đình". Thêm thành viên để đặt lịch khám cho họ.';
    } else if (msg.includes('bác sĩ')) {
      return 'Danh sách bác sĩ có thể xem tại mục "Bác sĩ". Bạn có thể tìm kiếm theo chuyên khoa hoặc tên bác sĩ.';
    } else if (msg.includes('hủy')) {
      return 'Để hủy lịch hẹn, vào mục "Lịch hẹn", chọn lịch cần hủy và nhấn nút "Hủy lịch hẹn".';
    } else {
      return 'Tôi có thể giúp bạn về: đặt lịch khám, xem kết quả, quản lý gia đình, tìm bác sĩ. Bạn cần hỗ trợ gì?';
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
        width={500}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: 16, 
            backgroundColor: '#f5f5f5' 
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
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
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {msg.content}
                </div>
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
