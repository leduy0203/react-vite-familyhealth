import React, { useEffect } from "react";
import { Modal, Form, Space, Typography } from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import RecordDetailsSubForm from "./form/RecordDetailsSubForm";
import RecordStatusSubForm from "./form/RecordStatusSubForm";

const { Text } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
  initialValues?: any;
  onSave: (values: any) => void;
}

const RecordForm: React.FC<Props> = ({
  visible,
  onClose,
  initialValues,
  onSave,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(
        initialValues || { patientName: "", summary: "", status: "new" }
      );
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...initialValues, ...values });
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {isEdit ? (
            <EditOutlined style={{ color: "#1890ff", fontSize: "20px" }} />
          ) : (
            <PlusOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
          )}
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            {isEdit ? "Chỉnh sửa Hồ sơ" : "Tạo Hồ sơ Mới"}
          </span>
        </Space>
      }
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnHidden
      width={700}
      okText={isEdit ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      centered
      styles={{
        header: {
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: 16,
          marginBottom: 24,
        },
      }}
    >
      <div style={{ padding: "8px 0" }}>
        {isEdit && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 16px",
              background: "#fafafa",
              borderRadius: "6px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Space>
              <FileTextOutlined style={{ color: "#1890ff" }} />
              <Text type="secondary" style={{ fontSize: "13px" }}>
                Mã hồ sơ: <Text strong>{initialValues.id}</Text>
              </Text>
            </Space>
          </div>
        )}

        <Form form={form} layout="vertical" size="large">
          <RecordDetailsSubForm />
          <RecordStatusSubForm />
        </Form>
      </div>
    </Modal>
  );
};

export default RecordForm;
