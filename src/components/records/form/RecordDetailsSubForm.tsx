import React from "react";
import { Form, Input } from "antd";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";

const RecordDetailsSubForm: React.FC = () => {
  return (
    <>
      <Form.Item
        label={
          <span>
            <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            Tên bệnh nhân
          </span>
        }
        name="patientName"
        rules={[
          { required: true, message: "Vui lòng nhập tên bệnh nhân" },
          { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
        ]}
      >
        <Input
          placeholder="Nhập họ và tên bệnh nhân"
          prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
        />
      </Form.Item>

      <Form.Item
        label={
          <span>
            <FileTextOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            Tóm tắt bệnh án
          </span>
        }
        name="summary"
        rules={[
          { required: true, message: "Vui lòng nhập tóm tắt bệnh án" },
          { min: 10, message: "Tóm tắt phải có ít nhất 10 ký tự" },
        ]}
        tooltip="Mô tả ngắn gọn về tình trạng sức khỏe"
      >
        <Input.TextArea
          rows={4}
          placeholder="Mô tả tóm tắt về bệnh án, triệu chứng, chẩn đoán..."
          showCount
          maxLength={500}
        />
      </Form.Item>
    </>
  );
};

export default RecordDetailsSubForm;
