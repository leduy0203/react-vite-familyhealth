import React, { useState } from "react";
import { Modal, Form, Input, Button, App } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { IMedicalRecord } from "../../../types/health";
import { useAppDispatch } from "../../../redux/hooks";
import { markRecordViewed } from "../../../redux/slice/recordSlice";

const { TextArea } = Input;

interface RecordStatusModalProps {
  open: boolean;
  record: IMedicalRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RecordStatusModal: React.FC<RecordStatusModalProps> = ({
  open,
  record,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!record) return;
    
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Assuming doctorId is available from context or auth
      const doctorId = "doctor"; // Replace with actual doctor ID from auth
      
      await dispatch(
        markRecordViewed({
          id: record.id,
          doctorId,
          note: values.note,
        })
      ).unwrap();

      message.success("Cập nhật trạng thái thành công");
      form.resetFields();
      onSuccess();
      onClose();
    } catch (err) {
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Xác nhận đã xem hồ sơ"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<CheckCircleOutlined />}
          loading={loading}
          onClick={handleSubmit}
        >
          Xác nhận đã xem
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Bệnh nhân">
          <Input value={record?.patientName} disabled />
        </Form.Item>

        <Form.Item label="Tóm tắt">
          <TextArea value={record?.summary} disabled rows={2} />
        </Form.Item>

        <Form.Item
          name="note"
          label="Ghi chú của bác sĩ"
          rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập nhận xét, ghi chú về hồ sơ..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecordStatusModal;
