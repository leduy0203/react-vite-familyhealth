import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import type { IAppointment } from "../../types/health";
import dayjs from "dayjs";

const { Option } = Select;

interface Props {
  visible: boolean;
  initial?: Partial<IAppointment> | null;
  onCancel: () => void;
  onSubmit: (payload: Partial<IAppointment>) => void;
}

const AppointmentForm: React.FC<Props> = ({
  visible,
  initial,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initial) {
      form.setFieldsValue({
        ...initial,
        datetime: initial.datetime ? dayjs(initial.datetime) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const payload: Partial<IAppointment> = {
      ...initial,
      patientName: values.patientName,
      doctor: values.doctor,
      datetime: values.datetime ? values.datetime.toISOString() : undefined,
      reason: values.reason,
      status: values.status,
    };
    onSubmit(payload);
  };

  return (
    <Modal
      title={initial ? "Sửa lịch hẹn" : "Tạo lịch hẹn"}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="patientName"
          label="Bệnh nhân"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="doctor" label="Bác sĩ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="datetime"
          label="Ngày giờ"
          rules={[{ required: true }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="reason" label="Lý do">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" initialValue="pending">
          <Select>
            <Option value="pending">Đang chờ</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="cancelled">Đã huỷ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentForm;
