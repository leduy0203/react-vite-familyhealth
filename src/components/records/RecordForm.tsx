import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  initialValues?: { id?: string; name?: string; owner?: string } | null;
  onSave: (values: { id?: string; name: string; owner: string }) => void;
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
      form.setFieldsValue(initialValues || { name: "", owner: "" });
    }
  }, [visible, initialValues]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSave({ ...initialValues, ...values });
    onClose();
  };

  return (
    <Modal
      title={initialValues?.id ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ"}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || { name: "", owner: "" }}
      >
        <Form.Item
          label="Tên hồ sơ"
          name="name"
          rules={[{ required: true, message: "Tên hồ sơ không được để trống" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Chủ sở hữu"
          name="owner"
          rules={[
            { required: true, message: "Chủ sở hữu không được để trống" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecordForm;
