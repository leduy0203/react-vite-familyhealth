import React from "react";
import { Modal, Form, Input, InputNumber, Space, App, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { IAppointment } from "../../types/health";
import { medicalResultService } from "../../services/medicalResultService";
import { appointmentService } from "../../services/appointmentService";

const { TextArea } = Input;

interface Props {
  open: boolean;
  appointment: IAppointment | null;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
}

const MedicalResultModal: React.FC<Props> = ({ open, appointment, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [appointmentDetail, setAppointmentDetail] = React.useState<IAppointment | null>(null);

  React.useEffect(() => {
    const loadAppointmentDetail = async () => {
      if (open && appointment) {
        setLoading(true);
        try {
          // Load full appointment details from API
          const response = await appointmentService.getById(Number(appointment.id));
          if (response.code === 200 && response.data) {
            setAppointmentDetail(response.data);
            // Pre-fill patient name from loaded data
            form.setFieldsValue({
              name: response.data.member?.fullName || response.data.patientName || "",
              diagnose: "",
              note: "",
              total_money: 0,
            });
          } else {
            // Fallback to appointment prop if API fails
            setAppointmentDetail(appointment);
            form.setFieldsValue({
              name: appointment.member?.fullName || appointment.patientName || "",
              diagnose: "",
              note: "",
              total_money: 0,
            });
          }
        } catch (error) {
          console.error("Error loading appointment:", error);
          // Fallback to appointment prop
          setAppointmentDetail(appointment);
          form.setFieldsValue({
            name: appointment.member?.fullName || appointment.patientName || "",
            diagnose: "",
            note: "",
            total_money: 0,
          });
        } finally {
          setLoading(false);
        }
      } else {
        form.resetFields();
        setAppointmentDetail(null);
      }
    };

    loadAppointmentDetail();
  }, [open, appointment, form]);

  const handleSubmit = async () => {
    if (!appointment) return;

    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const medicalResultData = {
        name: values.name,
        diagnose: values.diagnose,
        note: values.note,
        total_money: values.total_money,
        created_at: new Date().toISOString(),
        appointment_id: Number(appointment.id),
      };

      const response = await medicalResultService.create(medicalResultData);
      
      if (response.code === 201) {
        message.success("Lưu kết quả khám bệnh thành công");
        await onSubmit(); // Call parent to update appointment status to COMPLETED
        onCancel();
      } else {
        message.error("Lưu kết quả khám bệnh thất bại");
      }
    } catch (error) {
      console.error("Error submitting medical result:", error);
      message.error("Lưu kết quả khám bệnh thất bại");
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
      confirmLoading={submitting || loading}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Đang tải thông tin bệnh nhân...</div>
        </div>
      ) : appointmentDetail && (
        <>
          <div style={{ marginBottom: 16, padding: 16, background: "#f0f5ff", borderRadius: 8, border: "1px solid #d6e4ff" }}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserOutlined style={{ fontSize: 16, color: "#1890ff" }} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>Thông tin bệnh nhân</span>
              </div>
              <div style={{ paddingLeft: 24 }}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <div>
                    <strong>Họ tên:</strong> {appointmentDetail.member?.fullName || appointmentDetail.patientName || "N/A"}
                  </div>
                  <div>
                    <strong>Quan hệ:</strong> {appointmentDetail.member?.relation || "Chính chủ"}
                  </div>
                  <div>
                    <strong>Số BHYT:</strong> {appointmentDetail.member?.bhyt || "Không có"}
                  </div>
                  {appointmentDetail.note && (
                    <div style={{ 
                      marginTop: 8, 
                      padding: 12, 
                      background: "#fff", 
                      borderRadius: 6,
                      border: "1px solid #d9d9d9"
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: 4, color: "#1890ff" }}>
                        Lý do khám:
                      </div>
                      <div style={{ color: "#595959" }}>
                        {appointmentDetail.note}
                      </div>
                    </div>
                  )}
                </Space>
              </div>
            </Space>
          </div>

          <Form form={form} layout="vertical">
            <Form.Item
              label="Họ và tên bệnh nhân"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên bệnh nhân" }]}
            >
              <Input placeholder="Tên bệnh nhân" disabled />
            </Form.Item>

            <Form.Item
              label="Chẩn đoán"
              name="diagnose"
              rules={[{ required: true, message: "Vui lòng nhập chẩn đoán" }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Nhập chẩn đoán chi tiết (triệu chứng, bệnh lý, mã ICD-10 nếu có)..." 
              />
            </Form.Item>

            <Form.Item
              label="Ghi chú của bác sĩ"
              name="note"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
            >
              <TextArea 
                rows={6} 
                placeholder="Nhập ghi chú chi tiết: tiền sử bệnh, kết quả khám, hướng điều trị, đơn thuốc, xét nghiệm yêu cầu, lưu ý khác..." 
              />
            </Form.Item>

            <Form.Item
              label="Tổng chi phí (VNĐ)"
              name="total_money"
              rules={[
                { required: true, message: "Vui lòng nhập chi phí" },
                { type: "number", min: 0, message: "Chi phí phải lớn hơn hoặc bằng 0" }
              ]}
            >
              <InputNumber 
                style={{ width: "100%" }} 
                placeholder="Nhập tổng chi phí khám bệnh"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default MedicalResultModal;
