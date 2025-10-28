import React from "react";
import { Form, Select, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const RecordStatusSubForm: React.FC = () => {
  const statusOptions = [
    { value: "new", label: "Mới", color: "cyan" },
    { value: "transferred", label: "Đã chuyển", color: "blue" },
    { value: "viewed", label: "Đã xem", color: "geekblue" },
    { value: "appointment_suggested", label: "Đề xuất hẹn", color: "purple" },
    { value: "prescribed", label: "Đã kê đơn", color: "green" },
    { value: "closed", label: "Đã đóng", color: "default" },
    { value: "rejected", label: "Từ chối", color: "red" },
  ];

  return (
    <Form.Item
      label={
        <span>
          <CheckCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
          Trạng thái
        </span>
      }
      name="status"
      rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
    >
      <Select
        placeholder="-- Chọn trạng thái --"
        options={statusOptions.map((opt) => ({
          value: opt.value,
          label: (
            <Tag color={opt.color} style={{ marginRight: 0 }}>
              {opt.label}
            </Tag>
          ),
        }))}
      />
    </Form.Item>
  );
};

export default RecordStatusSubForm;
