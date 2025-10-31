import React, { useEffect, useState } from "react";
import { Row, Col, Breadcrumb, Card, Space, Typography, Empty, Spin } from "antd";
import { HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPatients } from "../../redux/slice/patientSlice";
import PatientCard from "../../components/patients/PatientCard";
import PatientDetailModal from "../../components/patients/PatientDetailModal";
import PatientFilter, {
  type PatientFilterValues,
} from "../../components/patients/PatientFilter";
import type { IPatient } from "../../redux/slice/patientSlice";

const { Title } = Typography;

const PatientsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.patient);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [filters, setFilters] = useState<PatientFilterValues>({});

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleViewDetails = (patient: IPatient) => {
    setSelectedPatient(patient);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  // Apply filters
  const filteredPatients = list.filter((patient) => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch =
        patient.name?.toLowerCase().includes(search) ||
        patient.email?.toLowerCase().includes(search) ||
        patient.phone?.toLowerCase().includes(search) ||
        patient.id?.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    // Gender filter
    if (filters.gender && patient.gender !== filters.gender) {
      return false;
    }

    // Blood type filter
    if (filters.bloodType && patient.bloodType !== filters.bloodType) {
      return false;
    }

    // Status filter
    if (filters.status && patient.status !== filters.status) {
      return false;
    }

    return true;
  });

  return (
    <div className="patients-page">
      {/* Breadcrumb Card */}
      <Card variant="borderless" className="breadcrumb-card" style={{ marginBottom: 16 }}>
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
                  <span>Quản lý bệnh nhân</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Main Content */}
      <Card variant="borderless">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Space align="center">
            <TeamOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Danh sách bệnh nhân
            </Title>
          </Space>
          <Typography.Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            Quản lý và theo dõi thông tin bệnh nhân
          </Typography.Text>
        </div>

        {/* Filter */}
        <PatientFilter onFilterChange={setFilters} />

        {/* Patient List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              filters.search || filters.gender || filters.bloodType || filters.status
                ? "Không tìm thấy bệnh nhân phù hợp"
                : "Chưa có bệnh nhân nào"
            }
            style={{ padding: "60px 0" }}
          />
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">
                Hiển thị {filteredPatients.length} / {list.length} bệnh nhân
              </Typography.Text>
            </div>
            <Row gutter={[16, 16]}>
              {filteredPatients.map((patient) => (
                <Col key={patient.id} xs={24} sm={12} lg={8} xl={6}>
                  <PatientCard patient={patient} onViewDetails={handleViewDetails} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Card>

      {/* Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        visible={!!selectedPatient}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PatientsPage;
