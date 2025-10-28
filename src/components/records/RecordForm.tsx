import React, { useEffect } from "react";
import { Modal, Form } from "antd";
import RecordDetailsSubForm from "./form/RecordDetailsSubForm";
import RecordStatusSubForm from "./form/RecordStatusSubForm";

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

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(
        initialValues || { patientName: "", summary: "", status: "pending" }
      );
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
      title={initialValues?.id ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ"}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <RecordDetailsSubForm />
        <RecordStatusSubForm />
      </Form>
    </Modal>
  );
};

export default RecordForm;
