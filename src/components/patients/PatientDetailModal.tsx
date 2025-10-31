import React, { useState } from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Avatar,
  Divider,
  Input,
  Button,
  App,
  Tabs,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  ContactsOutlined,
  FileTextOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { IPatient } from "../../redux/slice/patientSlice";
import { useAppDispatch } from "../../redux/hooks";
import { updatePatientNotes } from "../../redux/slice/patientSlice";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

interface PatientDetailModalProps {
  patient: IPatient | null;
  visible: boolean;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  visible,
  onClose,
}) => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState(patient?.notes || "");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (patient) {
      setNotes(patient.notes || "");
    }
  }, [patient]);

  if (!patient) return null;

  const age = patient.dob ? dayjs().diff(dayjs(patient.dob), "year") : null;

  const handleSaveNotes = async () => {
    if (!patient.id) return;
    setSaving(true);
    try {
      await dispatch(updatePatientNotes({ id: patient.id, notes })).unwrap();
      message.success("Cập nhật ghi chú thành công");
    } catch (err) {
      message.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const tabItems = [
    {
      key: "info",
      label: (
        <span>
          <UserOutlined /> Thông tin cơ bản
        </span>
      ),
      children: (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Họ và tên">
            <Text strong>{patient.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {patient.dob ? (
              <Space>
                <Text>{dayjs(patient.dob).format("DD/MM/YYYY")}</Text>
                {age && <Tag color="blue">{age} tuổi</Tag>}
              </Space>
            ) : (
              <Text type="secondary">Chưa cập nhật</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {patient.gender === "male" ? "Nam" : patient.gender === "female" ? "Nữ" : "Khác"}
          </Descriptions.Item>
          <Descriptions.Item label="Nhóm máu">
            {patient.bloodType || <Text type="secondary">Chưa cập nhật</Text>}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><PhoneOutlined />Điện thoại</Space>}>
            {patient.phone || <Text type="secondary">Chưa cập nhật</Text>}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><MailOutlined />Email</Space>}>
            {patient.email || <Text type="secondary">Chưa cập nhật</Text>}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><EnvironmentOutlined />Địa chỉ</Space>}>
            {patient.address || <Text type="secondary">Chưa cập nhật</Text>}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "medical",
      label: (
        <span>
          <MedicineBoxOutlined /> Thông tin y tế
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <div>
            <Title level={5}>
              <HeartOutlined /> Tiền sử bệnh
            </Title>
            {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
              <Space wrap>
                {patient.medicalHistory.map((item, idx) => (
                  <Tag key={idx} color="orange">
                    {item}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">Không có tiền sử bệnh</Text>
            )}
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div>
            <Title level={5}>
              <MedicineBoxOutlined /> Dị ứng
            </Title>
            {patient.allergies && patient.allergies.length > 0 ? (
              <Space wrap>
                {patient.allergies.map((item, idx) => (
                  <Tag key={idx} color="red">
                    {item}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">Không có dị ứng</Text>
            )}
          </div>

          <Divider style={{ margin: "12px 0" }} />

          <div>
            <Title level={5}>
              <ContactsOutlined /> Người liên hệ khẩn cấp
            </Title>
            {patient.emergencyContact ? (
              <Descriptions size="small" column={1}>
                <Descriptions.Item label="Họ tên">
                  {patient.emergencyContact.name}
                </Descriptions.Item>
                <Descriptions.Item label="Điện thoại">
                  {patient.emergencyContact.phone}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">Chưa cập nhật</Text>
            )}
          </div>
        </Space>
      ),
    },
    {
      key: "visits",
      label: (
        <span>
          <FileTextOutlined /> Lịch sử khám
        </span>
      ),
      children: (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Lần khám cuối">
            {patient.lastVisit ? (
              dayjs(patient.lastVisit).format("DD/MM/YYYY HH:mm")
            ) : (
              <Text type="secondary">Chưa có</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng số lần khám">
            <Tag color="blue">{patient.totalVisits || 0} lần</Tag>
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: "notes",
      label: (
        <span>
          <FileTextOutlined /> Ghi chú
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <TextArea
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nhập ghi chú về bệnh nhân..."
          />
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveNotes}
            loading={saving}
          >
            Lưu ghi chú
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      title={
        <Space>
          <Avatar size={40} icon={<UserOutlined />} src={patient.avatar} />
          <div>
            <div>{patient.name}</div>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: "normal" }}>
              Mã BN: {patient.id}
            </Text>
          </div>
        </Space>
      }
    >
      <Tabs items={tabItems} />
    </Modal>
  );
};

export default PatientDetailModal;
