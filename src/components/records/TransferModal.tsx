import React, { useState, useEffect } from "react";
import { Modal, Select, Space, Typography, Spin, App } from "antd";
import { SwapOutlined, UserOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import { transferRecord } from "../../redux/slice/recordSlice";
import type { IMedicalRecord } from "../../types/health";

const { Text } = Typography;

interface TransferModalProps {
  open: boolean;
  record: IMedicalRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  open,
  record,
  onClose,
  onSuccess,
}) => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    if (open) {
      loadDoctors();
    } else {
      setSelectedDoctor(null);
    }
  }, [open]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await import("../../config/api");
      const docs = await res.api.getDoctors();
      setDoctors(docs.data || []);
    } catch (err) {
      message.error("Không thể tải danh sách bác sĩ");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!record || !selectedDoctor) {
      message.warning("Vui lòng chọn bác sĩ");
      return;
    }

    setTransferring(true);
    try {
      await dispatch(
        transferRecord({ id: record.id, doctorId: selectedDoctor })
      ).unwrap();
      message.success("Đã chuyển hồ sơ cho bác sĩ thành công");
      onSuccess?.();
      onClose();
    } catch (err) {
      message.error("Chuyển hồ sơ thất bại");
    } finally {
      setTransferring(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <SwapOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            Chuyển Hồ sơ Bệnh án
          </span>
        </Space>
      }
      open={open}
      onOk={handleTransfer}
      onCancel={onClose}
      okText="Xác nhận chuyển"
      cancelText="Hủy"
      width={550}
      confirmLoading={transferring}
      okButtonProps={{ disabled: !selectedDoctor }}
    >
      <div style={{ padding: "16px 0" }}>
        {record && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 16px",
              background: "#f0f5ff",
              borderRadius: "6px",
              border: "1px solid #d6e4ff",
            }}
          >
            <Text strong style={{ color: "#1890ff" }}>
              Bệnh nhân:{" "}
            </Text>
            <Text style={{ fontSize: "15px" }}>{record.patientName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "13px" }}>
              {record.summary || "Chưa có tóm tắt"}
            </Text>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ fontSize: "14px" }}>
            Chọn bác sĩ để chuyển hồ sơ
          </Text>
          <Text type="secondary" style={{ fontSize: "13px", marginLeft: 8 }}>
            (Bắt buộc)
          </Text>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Spin />
          </div>
        ) : (
          <Select
            style={{ width: "100%" }}
            size="large"
            value={selectedDoctor}
            onChange={(v) => setSelectedDoctor(v)}
            placeholder="-- Vui lòng chọn bác sĩ --"
            showSearch
            optionFilterProp="children"
            suffixIcon={<UserOutlined />}
            disabled={doctors.length === 0}
            notFoundContent={
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Text type="secondary">Không có bác sĩ nào</Text>
              </div>
            }
          >
            {doctors.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                <Space>
                  <UserOutlined style={{ color: "#52c41a" }} />
                  <Text>{d.name}</Text>
                  {d.specialty && (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      ({d.specialty})
                    </Text>
                  )}
                </Space>
              </Select.Option>
            ))}
          </Select>
        )}
      </div>
    </Modal>
  );
};

export default TransferModal;
