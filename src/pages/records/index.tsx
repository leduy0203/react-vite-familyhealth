import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Card,
  Tag,
  Typography,
  Tooltip,
  Breadcrumb,
  Input,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SwapOutlined,
  FileTextOutlined,
  UserOutlined,
  EyeOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchRecords, createRecord } from "../../redux/slice/recordSlice";
import RecordForm from "../../components/records/RecordForm";
import TransferModal from "../../components/records/TransferModal";
import type { IMedicalRecord } from "../../types/health";
import Access from "../../components/share/Access";

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
      render: (text: string) => (
        <Text style={{ color: "#595959" }}>{text || "Chưa có thông tin"}</Text>
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
    <div>
      {/* Breadcrumb Card */}
      <Card
        variant="borderless"
        style={{
          marginBottom: 16,
          borderRadius: "8px",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        }}
        styles={{ body: { padding: "12px 24px" } }}
      >
        <Breadcrumb
          style={{ fontSize: "18px" }}
          items={[
            {
              href: "/",
              title: (
                <Space>
                  <HomeOutlined style={{ fontSize: "16px" }} />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: (
                <Space>
                  <FileTextOutlined style={{ fontSize: "16px" }} />
                  <span>Hồ sơ bệnh án</span>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Main Content Card */}
      <Card
        variant="borderless"
        style={{
          borderRadius: "8px",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <Space align="center" style={{ marginBottom: 20 }}>
            <FileTextOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <Title level={5} style={{ margin: 0 }}>
              Quản lý Hồ sơ
            </Title>
          </Space>

          {/* Search and Create Button Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 11,
            }}
          >
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              style={{ maxWidth: 280 }}
            />
            <Access permission="create_record" hideChildren>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleAdd}
                style={{ borderRadius: "6px", maxWidth: 160 }}
              >
                Tạo hồ sơ mới
              </Button>
            </Access>
          </div>
        </div>

        <Table
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
              <div style={{ padding: "40px 0" }}>
                <FileTextOutlined
                  style={{ fontSize: "48px", color: "#d9d9d9" }}
                />
                <div style={{ marginTop: "16px", color: "#8c8c8c" }}>
                  Chưa có hồ sơ bệnh án nào
                </div>
              </div>
            ),
          }}
          style={{ marginTop: "16px" }}
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
