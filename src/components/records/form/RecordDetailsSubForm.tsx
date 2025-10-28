import React from "react";
import { Form, Input } from "antd";

const RecordDetailsSubForm: React.FC = () => {
  return (
    <>
      <Form.Item
        label="Tên bệnh nhân"
        name="patientName"
        rules={[
          { required: true, message: "Tên bệnh nhân không được để trống" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tóm tắt"
        name="summary"
        rules={[{ required: true, message: "Tóm tắt không được để trống" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
    </>
  );
};

export default RecordDetailsSubForm;
