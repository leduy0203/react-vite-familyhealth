import React from "react";
import { Form, Select } from "antd";

const RecordStatusSubForm: React.FC = () => {
  return (
    <Form.Item label="Trạng thái" name="status">
      <Select>
        <Select.Option value="pending">Chờ khám</Select.Option>
        <Select.Option value="in-progress">Đang xử lý</Select.Option>
        <Select.Option value="completed">Hoàn thành</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default RecordStatusSubForm;
