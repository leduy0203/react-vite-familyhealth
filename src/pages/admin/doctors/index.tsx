import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  Card,
  Table,
  Tag,
  Space,
  Input,
  Typography,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  ControlOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { doctorService } from "../../../services/doctorService";
import { EXPERTISE_LABELS, GENDER_LABELS } from "../../../constants/expertise";
import type { IDoctorNew } from "../../../types/doctor.types";
import DoctorFormModal from "../../../components/admin/doctors/DoctorFormModal";
import DoctorDetailModal from "../../../components/admin/doctors/DoctorDetailModal";

const { Title, Text } = Typography;

const AdminDoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctorNew[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctorNew | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { message } = App.useApp();

  const fetchDoctors = async (page = 1, size = 10, search?: string) => {
    setLoading(true);
    try {
      // Format search theo API: name:keyword
      const searchParam = search ? `name:${search}` : undefined;
      const response = await doctorService.getList({
        page: page - 1,
        pageSize: size,
        search: searchParam,
      });
      setDoctors(response.data.result);
      setTotal(response.data.meta.total);
    } catch (error) {
      message.error("Không thể tải danh sách bác sĩ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage, pageSize, searchText || undefined);
  }, [currentPage, pageSize]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchDoctors(1, pageSize, value || undefined);
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleViewDetail = (doctor: IDoctorNew) => {
    setSelectedDoctor(doctor);
    setIsDetailModalOpen(true);
  };

  const handleCreateDoctor = async (values: any) => {
    setCreateLoading(true);
    try {
      const payload = {
        phone: values.phone,
        password: values.password,
        role_id: 2, // Doctor role
        fullname: values.fullname,
        idCard: values.idCard,
        address: values.address,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        email: values.email,
        expertise: values.expertise,
        bio: values.bio,
      };

      await doctorService.create(payload);
      message.success("Thêm bác sĩ thành công!");
      setIsModalOpen(false);
      fetchDoctors(currentPage, pageSize, searchText || undefined);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Không thể thêm bác sĩ"
      );
      console.error(error);
    } finally {
      setCreateLoading(false);
    }
  };

  const columns: ColumnsType<IDoctorNew> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender: string) => (
        <Tag color={gender === "MALE" ? "blue" : "pink"}>
          {GENDER_LABELS[gender as keyof typeof GENDER_LABELS]}
        </Tag>
      ),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "expertise",
      key: "expertise",
      width: 150,
      render: (expertise: string) => (
        <Tag color="cyan">
          {EXPERTISE_LABELS[expertise as keyof typeof EXPERTISE_LABELS] ||
            expertise}
        </Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "CMND/CCCD",
      dataIndex: "idCard",
      key: "idCard",
      width: 120,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0" }}>
      {/* Breadcrumb */}
      <Card variant="borderless" style={{ marginBottom: 16 }}>
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
                  <ControlOutlined />
                  <span>Quản trị</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <MedicineBoxOutlined />
                  <span>Quản lý bác sĩ</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Main Content */}
      <Card variant="borderless">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <MedicineBoxOutlined />
              Quản lý Bác sĩ
            </Title>
            <Text type="secondary">Tổng số: {total} bác sĩ</Text>
          </div>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm theo tên..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              allowClear
              enterButton
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Thêm bác sĩ
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => message.success('Chức năng xuất Excel đang được phát triển')}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Xuất Excel
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={doctors}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bác sĩ`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* Modals */}
      <DoctorFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onFinish={handleCreateDoctor}
        loading={createLoading}
      />

      <DoctorDetailModal
        open={isDetailModalOpen}
        doctor={selectedDoctor}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default AdminDoctorsPage;
