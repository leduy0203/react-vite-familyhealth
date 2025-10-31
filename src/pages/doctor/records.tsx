import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Space,
  Typography,
  Tag,
  Breadcrumb,
  Input,
  Select,
  Modal,
  Tabs,
} from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchRecords } from "../../redux/slice/recordSlice";
import RecordActionButtons from "../../components/records/doctor/RecordActionButtons";
import RecordStatusModal from "../../components/records/doctor/RecordStatusModal";
import RecordDetailCard from "../../components/records/doctor/RecordDetailCard";
import type { IMedicalRecord } from "../../types/health";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

const DoctorRecordsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.record);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<IMedicalRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [recordForStatus, setRecordForStatus] = useState<IMedicalRecord | null>(null);

  useEffect(() => {
    // Fetch records assigned to this doctor
    // In real app, pass doctorId from auth context
    dispatch(fetchRecords({ assignedTo: "doctor" }));
  }, [dispatch]);

  const handleViewRecord = (record: IMedicalRecord) => {
    setSelectedRecord(record);
    setViewModalOpen(true);
  };

  const handleMarkViewed = (record: IMedicalRecord) => {
    setRecordForStatus(record);
    setStatusModalOpen(true);
  };

  const handleStatusSuccess = () => {
    dispatch(fetchRecords({ assignedTo: "doctor" }));
  };

  const getStatusTag = (status?: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      new: { color: "cyan", text: "Mới" },
      transferred: { color: "blue", text: "Đã chuyển" },
      viewed: { color: "geekblue", text: "Đã xem" },
      appointment_suggested: { color: "purple", text: "Đề xuất hẹn" },
      prescribed: { color: "green", text: "Đã kê đơn" },
      closed: { color: "default", text: "Đã đóng" },
      rejected: { color: "red", text: "Từ chối" },
    };
    const config = statusConfig[status || "new"] || {
      color: "default",
      text: status || "N/A",
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Filter records
  const filteredRecords = list.filter((record) => {
    // Search filter
    if (searchText) {
      const search = searchText.toLowerCase();
      const matchesSearch =
        record.patientName?.toLowerCase().includes(search) ||
        record.summary?.toLowerCase().includes(search) ||
        record.id?.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "all" && record.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Group by status for tabs
  const newRecords = list.filter((r) => r.status === "new" || r.status === "transferred");
  const viewedRecords = list.filter((r) => r.status === "viewed");
  const processedRecords = list.filter(
    (r) =>
      r.status === "appointment_suggested" ||
      r.status === "prescribed" ||
      r.status === "closed"
  );

  const columns: ColumnsType<IMedicalRecord> = [
    {
      title: "Mã hồ sơ",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Tóm tắt",
      dataIndex: "summary",
      key: "summary",
      ellipsis: true,
      render: (text: string) => <Text>{text || "Chưa có thông tin"}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 200,
      render: (_: any, record: IMedicalRecord) => (
        <RecordActionButtons
          record={record}
          onView={handleViewRecord}
          onMarkViewed={handleMarkViewed}
          compact={false}
        />
      ),
    },
  ];

  const tabItems = [
    {
      key: "all",
      label: `Tất cả (${list.length})`,
      children: (
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredRecords}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} hồ sơ`,
          }}
        />
      ),
    },
    {
      key: "new",
      label: (
        <span>
          Mới <Tag color="cyan">{newRecords.length}</Tag>
        </span>
      ),
      children: (
        <Table
          rowKey="id"
          loading={loading}
          dataSource={newRecords.filter((r) => {
            if (!searchText) return true;
            const search = searchText.toLowerCase();
            return (
              r.patientName?.toLowerCase().includes(search) ||
              r.summary?.toLowerCase().includes(search) ||
              r.id?.toLowerCase().includes(search)
            );
          })}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} hồ sơ`,
          }}
        />
      ),
    },
    {
      key: "viewed",
      label: (
        <span>
          Đã xem <Tag color="geekblue">{viewedRecords.length}</Tag>
        </span>
      ),
      children: (
        <Table
          rowKey="id"
          loading={loading}
          dataSource={viewedRecords.filter((r) => {
            if (!searchText) return true;
            const search = searchText.toLowerCase();
            return (
              r.patientName?.toLowerCase().includes(search) ||
              r.summary?.toLowerCase().includes(search) ||
              r.id?.toLowerCase().includes(search)
            );
          })}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} hồ sơ`,
          }}
        />
      ),
    },
    {
      key: "processed",
      label: (
        <span>
          Đã xử lý <Tag color="green">{processedRecords.length}</Tag>
        </span>
      ),
      children: (
        <Table
          rowKey="id"
          loading={loading}
          dataSource={processedRecords.filter((r) => {
            if (!searchText) return true;
            const search = searchText.toLowerCase();
            return (
              r.patientName?.toLowerCase().includes(search) ||
              r.summary?.toLowerCase().includes(search) ||
              r.id?.toLowerCase().includes(search)
            );
          })}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} hồ sơ`,
          }}
        />
      ),
    },
  ];

  return (
    <div className="doctor-records-page">
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
                  <FileTextOutlined />
                  <span>Quản lý hồ sơ</span>
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
            <FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Hồ sơ bệnh án được chuyển đến
            </Title>
          </Space>
          <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            Quản lý và xử lý các hồ sơ bệnh án từ bệnh nhân
          </Text>
        </div>

        {/* Filter */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space wrap style={{ width: "100%" }}>
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân, mã hồ sơ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: 200 }}
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="new">Mới</Select.Option>
              <Select.Option value="transferred">Đã chuyển</Select.Option>
              <Select.Option value="viewed">Đã xem</Select.Option>
              <Select.Option value="appointment_suggested">Đề xuất hẹn</Select.Option>
              <Select.Option value="prescribed">Đã kê đơn</Select.Option>
              <Select.Option value="closed">Đã đóng</Select.Option>
            </Select>
          </Space>
        </Card>

        {/* Tabs with Records */}
        <Tabs items={tabItems} />
      </Card>

      {/* View Detail Modal */}
      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={900}
        title={
          <Space>
            <EyeOutlined />
            <span>Chi tiết hồ sơ bệnh án</span>
          </Space>
        }
      >
        {selectedRecord && <RecordDetailCard record={selectedRecord} />}
      </Modal>

      {/* Mark Viewed Modal */}
      <RecordStatusModal
        open={statusModalOpen}
        record={recordForStatus}
        onClose={() => setStatusModalOpen(false)}
        onSuccess={handleStatusSuccess}
      />
    </div>
  );
};

export default DoctorRecordsPage;
