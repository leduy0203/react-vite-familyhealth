import React from "react";
import { Modal, Form, Input, DatePicker, Space, Tag, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { IAppointment } from "../../types/health";
import dayjs from "dayjs";

const { TextArea } = Input;

interface Props {
  open: boolean;
  appointment: IAppointment | null;
  onCancel: () => void;
  onSubmit: (appointmentId: string | number, result: IAppointment["medicalResult"]) => Promise<void>;
}

const MedicalResultModal: React.FC<Props> = ({ open, appointment, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [symptoms, setSymptoms] = React.useState<string[]>([]);
  const [labTests, setLabTests] = React.useState<string[]>([]);
  const [inputSymptom, setInputSymptom] = React.useState("");
  const [inputLabTest, setInputLabTest] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open && appointment) {
      // Pre-fill if already has result
      if (appointment.medicalResult) {
        form.setFieldsValue({
          diagnosis: appointment.medicalResult.diagnosis,
          treatment: appointment.medicalResult.treatment,
          prescription: appointment.medicalResult.prescription,
          notes: appointment.medicalResult.notes,
          followUpDate: appointment.medicalResult.followUpDate
            ? dayjs(appointment.medicalResult.followUpDate)
            : undefined,
        });
        setSymptoms(appointment.medicalResult.symptoms || []);
        setLabTests(appointment.medicalResult.labTests || []);
      } else {
        form.resetFields();
        setSymptoms([]);
        setLabTests([]);
      }
    }
  }, [open, appointment, form]);

  const handleAddSymptom = () => {
    if (inputSymptom.trim() && !symptoms.includes(inputSymptom.trim())) {
      setSymptoms([...symptoms, inputSymptom.trim()]);
      setInputSymptom("");
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleAddLabTest = () => {
    if (inputLabTest.trim() && !labTests.includes(inputLabTest.trim())) {
      setLabTests([...labTests, inputLabTest.trim()]);
      setInputLabTest("");
    }
  };

  const handleRemoveLabTest = (test: string) => {
    setLabTests(labTests.filter((t) => t !== test));
  };

  const handleSubmit = async () => {
    if (!appointment) return;

    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const result: IAppointment["medicalResult"] = {
        diagnosis: values.diagnosis,
        symptoms,
        treatment: values.treatment,
        prescription: values.prescription,
        labTests,
        followUpDate: values.followUpDate ? values.followUpDate.format("YYYY-MM-DD") : undefined,
        notes: values.notes,
      };

      await onSubmit(appointment.id, result);
      message.success("Lưu kết quả khám thành công");
      onCancel();
    } catch (error) {
      console.error("Error submitting medical result:", error);
      message.error("Lưu kết quả thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      title="📋 Nhập kết quả khám bệnh"
      width={800}
      okText="Lưu kết quả"
      cancelText="Hủy"
      confirmLoading={submitting}
    >
      {appointment && (
        <>
          <div style={{ marginBottom: 16, padding: 12, background: "#f5f5f5", borderRadius: 8 }}>
            <Space direction="vertical" size={4}>
              <div>
                <strong>Bệnh nhân:</strong> {appointment.patientName}
              </div>
              <div>
                <strong>Lý do khám:</strong> {appointment.note || "Không có"}
              </div>
            </Space>
          </div>

          <Form form={form} layout="vertical">
            <Form.Item
              label="Chẩn đoán"
              name="diagnosis"
              rules={[{ required: true, message: "Vui lòng nhập chẩn đoán" }]}
            >
              <TextArea rows={3} placeholder="Nhập chẩn đoán của bác sĩ..." />
            </Form.Item>

            <Form.Item label="Triệu chứng">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Nhập triệu chứng và nhấn Enter"
                    value={inputSymptom}
                    onChange={(e) => setInputSymptom(e.target.value)}
                    onPressEnter={handleAddSymptom}
                  />
                  <button
                    type="button"
                    onClick={handleAddSymptom}
                    style={{
                      padding: "0 16px",
                      border: "1px solid #d9d9d9",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <PlusOutlined />
                  </button>
                </Space.Compact>
                <div>
                  {symptoms.map((symptom) => (
                    <Tag
                      key={symptom}
                      closable
                      onClose={() => handleRemoveSymptom(symptom)}
                      style={{ marginBottom: 8 }}
                    >
                      {symptom}
                    </Tag>
                  ))}
                </div>
              </Space>
            </Form.Item>

            <Form.Item label="Hướng điều trị" name="treatment">
              <TextArea rows={3} placeholder="Nhập hướng điều trị..." />
            </Form.Item>

            <Form.Item label="Đơn thuốc" name="prescription">
              <TextArea rows={4} placeholder="Nhập đơn thuốc (tên thuốc, liều lượng, cách dùng)..." />
            </Form.Item>

            <Form.Item label="Xét nghiệm yêu cầu">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Nhập xét nghiệm và nhấn Enter"
                    value={inputLabTest}
                    onChange={(e) => setInputLabTest(e.target.value)}
                    onPressEnter={handleAddLabTest}
                  />
                  <button
                    type="button"
                    onClick={handleAddLabTest}
                    style={{
                      padding: "0 16px",
                      border: "1px solid #d9d9d9",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <PlusOutlined />
                  </button>
                </Space.Compact>
                <div>
                  {labTests.map((test) => (
                    <Tag
                      key={test}
                      closable
                      onClose={() => handleRemoveLabTest(test)}
                      color="blue"
                      style={{ marginBottom: 8 }}
                    >
                      {test}
                    </Tag>
                  ))}
                </div>
              </Space>
            </Form.Item>

            <Form.Item label="Ngày tái khám" name="followUpDate">
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày tái khám"
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>

            <Form.Item label="Ghi chú thêm" name="notes">
              <TextArea rows={2} placeholder="Ghi chú bổ sung..." />
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default MedicalResultModal;
