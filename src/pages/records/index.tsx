import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchRecords, createRecord } from "../../redux/slice/recordSlice";
import RecordForm from "../../components/records/RecordForm";
import TransferModal from "../../components/records/TransferModal";
import type { IMedicalRecord } from "../../types/health";
import Access from "../../components/share/Access";
import "../../styles/records.scss";

const { Title, Text } = Typography;

const RecordsPage: React.FC = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading } = useAppSelector((s) => s.record);

  const [openForm, setOpenForm] = useState(false);
  const [editItem, setEditItem] = useState<IMedicalRecord | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferRecord, setTransferRecord] = useState<IMedicalRecord | null>(
    null
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  const handleAdd = () => {
    setEditItem(null);
    setOpenForm(true);
  };

  const handleEdit = (record: IMedicalRecord) => {
    setEditItem(record);
    setOpenForm(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (values.id) {
        message.success("Cập nhật thành công (local)");
      } else {
        await dispatch(createRecord(values)).unwrap();
        message.success("Tạo hồ sơ thành công");
      }
      setOpenForm(false);
      dispatch(fetchRecords());
    } catch (err) {
      message.error("Thao tác thất bại");
    }
  };

  const handleOpenTransfer = (record: IMedicalRecord) => {
    setTransferRecord(record);
    setTransferOpen(true);
  };

  const handleTransferSuccess = () => {
    dispatch(fetchRecords());
  };

  // Filter records based on search
  const filteredList = list.filter((record) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      record.patientName?.toLowerCase().includes(search) ||
      record.summary?.toLowerCase().includes(search) ||
      record.id?.toLowerCase().includes(search)
    );
  });

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

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (text: string) => (
        <Space className="patient-cell">
          <UserOutlined className="icon" />
          <Text strong className="text">
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: "Tóm tắt",
      dataIndex: "summary",
      key: "summary",
      ellipsis: true,
      render: (text: string) => (
        <Text className="summary-cell">{text || "Chưa có thông tin"}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: IMedicalRecord) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/records/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Chuyển hồ sơ">
            <Button
              size="small"
              icon={<SwapOutlined />}
              onClick={() => handleOpenTransfer(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="records-page">
      {/* Breadcrumb Card */}
      <Card variant="borderless" className="breadcrumb-card">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined className="icon" />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <FileTextOutlined className="icon" />
                  <span>Hồ sơ bệnh án</span>
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
          <Space align="center" className="header-title">
            <FileTextOutlined className="icon" />
            <Title level={5}>Quản lý Hồ sơ</Title>
          </Space>

          {/* Search and Create Button Row */}
          <div className="search-actions">
            <Input
              className="search-input"
              placeholder="Tìm kiếm theo tên bệnh nhân"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
            />
            <Access permission="create_record" hideChildren>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAdd}
                className="create-button"
              >
                Tạo hồ sơ mới
              </Button>
            </Access>
          </div>
        </div>

        <Table
          className="records-table"
          rowKey="id"
          loading={loading}
          dataSource={filteredList}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} hồ sơ`,
          }}
          locale={{
            emptyText: (
              <div className="empty-state">
                <FileTextOutlined className="icon" />
                <div className="text">Chưa có hồ sơ bệnh án nào</div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Form Modal */}
      <RecordForm
        visible={openForm}
        onClose={() => setOpenForm(false)}
        initialValues={editItem as any}
        onSave={handleSave}
      />

      {/* Transfer Modal */}
      <TransferModal
        open={transferOpen}
        record={transferRecord}
        onClose={() => setTransferOpen(false)}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
};

export default RecordsPage;
