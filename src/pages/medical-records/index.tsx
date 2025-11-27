import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Descriptions, 
  Timeline,
  Empty,
  Spin,
  Avatar,
  Statistic,
  Row,
  Col,
  Input,
  message
} from 'antd';
import {
  UserOutlined,
  EyeOutlined,
  HistoryOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  DownloadOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import { familyService, getRelationText, getGenderText } from '../../services/familyService';
import type { IFamilyMemberNew } from '../../services/familyService';
import type { IAppointment } from '../../types/health';
import dayjs from 'dayjs';

const MedicalRecordsPage: React.FC = () => {
  const [members, setMembers] = useState<IFamilyMemberNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<IFamilyMemberNew | null>(null);
  const [memberAppointments, setMemberAppointments] = useState<IAppointment[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [exportDirectory, setExportDirectory] = useState<string>('C:\\Downloads');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await familyService.getList();
      if (response.code === 200) {
        setMembers(response.data.result);
      }
    } catch (error) {
      console.error('Error loading family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMemberAppointments = async (memberId: number) => {
    try {
      setLoadingAppointments(true);
      // Gọi API mới để lấy medical records của member
      const response = await fetch(`http://localhost:8080/familyhealth/api/v1/members/members-medicalRecord/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load medical records');
      }
      
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        // Update selected member với thông tin đầy đủ
        setSelectedMember(prev => prev ? {
          ...prev,
          fullname: data.data.fullname,
          idCard: data.data.idCard,
          gender: data.data.gender,
          dateOfBirth: data.data.dateOfBirth,
          email: data.data.email,
          bhyt: data.data.bhyt
        } : prev);
        
        // Convert medical results sang format IAppointment để tương thích với UI
        const convertedAppointments: IAppointment[] = data.data.medicalResults.map((result: any) => ({
          id: result.id,
          time: result.appointmentTime,
          appointmentDate: result.appointmentTime,
          status: 'COMPLETED',
          doctorName: result.doctorName,
          location: 'N/A',
          medicalResult: {
            id: result.id,
            name: result.name,
            diagnose: result.diagnose,
            note: result.note,
            totalMoney: result.totalMoney,
            diagnosis: result.diagnose
          },
          member: {
            id: data.data.id,
            fullName: data.data.fullname,
            relation: '',
            bhyt: data.data.bhyt
          },
          doctor: {
            id: 0,
            fullName: result.doctorName,
            expertise: ''
          }
        }));
        
        setMemberAppointments(convertedAppointments);
      }
    } catch (error) {
      console.error('Error loading medical records:', error);
      setMemberAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleViewDetails = async (member: IFamilyMemberNew) => {
    setSelectedMember(member);
    setDetailModalOpen(true);
    await loadMemberAppointments(member.id);
  };

  const handleExportReport = async () => {
    if (!selectedMember) return;
    
    if (!exportDirectory.trim()) {
      message.error('Vui lòng nhập đường dẫn thư mục');
      return;
    }

    try {
      setExporting(true);
      const response = await fetch(
        `http://localhost:8080/familyhealth/api/v1/reports/member/${selectedMember.id}/save?outputDirectory=${encodeURIComponent(exportDirectory)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const result = await response.json();
      
      if (result.code === 200) {
        message.success(`Xuất báo cáo thành công! File đã được lưu tại: ${exportDirectory}`);
      } else {
        throw new Error(result.message || 'Export failed');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      const errorMessage = error?.message || 'Unknown error';
      
      if (errorMessage.includes('UUID') || errorMessage.includes('template')) {
        message.error({
          content: 'Lỗi template báo cáo. Vui lòng liên hệ quản trị viên để cập nhật template.',
          duration: 5
        });
      } else if (errorMessage.includes('directory') || errorMessage.includes('path')) {
        message.error('Đường dẫn không hợp lệ hoặc không có quyền truy cập. Vui lòng kiểm tra lại.');
      } else {
        message.error('Xuất báo cáo thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: 'blue',
      CONFIRMED: 'cyan',
      COMPLETED: 'green',
      CANCELLED: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      SCHEDULED: 'Đã đặt lịch',
      CONFIRMED: 'Đã xác nhận',
      COMPLETED: 'Đã hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Thành viên',
      key: 'member',
      render: (_: any, record: IFamilyMemberNew) => (
        <Space>
          <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.fullname}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {getGenderText(record.gender)} • {getRelationText(record.relation)}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'idCard',
      key: 'idCard',
    },
    {
      title: 'BHYT',
      dataIndex: 'bhyt',
      key: 'bhyt',
      render: (bhyt: string) => bhyt || <Tag color="orange">Chưa có</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IFamilyMemberNew) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Xem hồ sơ
        </Button>
      ),
    },
  ];

  const completedAppointments = memberAppointments.filter(apt => apt.status === 'COMPLETED');
  const totalAppointments = memberAppointments.length;
  const upcomingAppointments = memberAppointments.filter(
    apt => apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'
  ).length;

  return (
    <div>
      {/* Header Card */}
      <Card style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>Hồ sơ bệnh án</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Quản lý hồ sơ y tế và lịch sử khám bệnh của các thành viên gia đình
        </p>
      </Card>

      {/* Members Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={members}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} thành viên`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <span>Hồ sơ bệnh án - {selectedMember?.fullname}</span>
          </Space>
        }
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedMember(null);
          setMemberAppointments([]);
        }}
        footer={null}
        width={900}
      >
        {selectedMember && (
          <div>
            {/* Member Info */}
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Họ tên">{selectedMember.fullname}</Descriptions.Item>
                <Descriptions.Item label="Quan hệ">
                  {getRelationText(selectedMember.relation)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {dayjs(selectedMember.dateOfBirth).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {getGenderText(selectedMember.gender)}
                </Descriptions.Item>
                <Descriptions.Item label="CMND/CCCD">{selectedMember.idCard}</Descriptions.Item>
                <Descriptions.Item label="BHYT">
                  {selectedMember.bhyt || <Tag color="orange">Chưa có</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedMember.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Export Section */}
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#e6f7ff' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  <DownloadOutlined /> Xuất báo cáo PDF
                </div>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Nhập đường dẫn thư mục (ví dụ: C:\\Downloads)"
                    value={exportDirectory}
                    onChange={(e) => setExportDirectory(e.target.value)}
                    prefix={<FolderOpenOutlined />}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={exporting}
                    onClick={handleExportReport}
                  >
                    Xuất báo cáo
                  </Button>
                </Space.Compact>
                <div style={{ fontSize: 12, color: '#666' }}>
                  * Báo cáo sẽ bao gồm thông tin cá nhân và lịch sử khám bệnh chi tiết
                </div>
              </Space>
            </Card>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tổng lượt khám"
                    value={totalAppointments}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Đã hoàn thành"
                    value={completedAppointments.length}
                    prefix={<MedicineBoxOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Sắp tới"
                    value={upcomingAppointments}
                    prefix={<HistoryOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Appointment History */}
            <Card 
              title={
                <Space>
                  <HistoryOutlined />
                  <span>Lịch sử khám bệnh</span>
                </Space>
              }
              size="small"
            >
              {loadingAppointments ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin />
                </div>
              ) : memberAppointments.length > 0 ? (
                <Timeline
                  items={memberAppointments
                    .sort((a, b) => 
                      dayjs(b.time || b.appointmentDate).valueOf() - 
                      dayjs(a.time || a.appointmentDate).valueOf()
                    )
                    .map((apt) => {
                      const aptDate = apt.time || apt.appointmentDate;
                      return {
                        color: apt.status === 'COMPLETED' ? 'green' : 'blue',
                        children: (
                          <div>
                            <div style={{ marginBottom: 8 }}>
                              <Tag color={getStatusColor(apt.status)}>
                                {getStatusText(apt.status)}
                              </Tag>
                              <span style={{ fontWeight: 600 }}>
                                {dayjs(aptDate).format('DD/MM/YYYY HH:mm')}
                              </span>
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Bác sĩ:</strong> {apt.doctor?.fullName || apt.doctorName || 'N/A'}
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <strong>Địa điểm:</strong> {apt.location || 'N/A'}
                            </div>
                            {apt.status === 'COMPLETED' && apt.medicalResult && (
                              <Card size="small" style={{ marginTop: 8, backgroundColor: '#f0f9ff' }}>
                                <div style={{ marginBottom: 4 }}>
                                  <strong>Chẩn đoán:</strong> {apt.medicalResult.diagnose || apt.medicalResult.diagnosis}
                                </div>
                                {apt.medicalResult.note && (
                                  <div style={{ marginBottom: 4 }}>
                                    <strong>Ghi chú:</strong> {apt.medicalResult.note}
                                  </div>
                                )}
                                {apt.medicalResult.totalMoney && (
                                  <div>
                                    <strong>Chi phí:</strong>{' '}
                                    {apt.medicalResult.totalMoney.toLocaleString('vi-VN')} VNĐ
                                  </div>
                                )}
                              </Card>
                            )}
                          </div>
                        ),
                      };
                    })}
                />
              ) : (
                <Empty description="Chưa có lịch sử khám bệnh" />
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicalRecordsPage;
