import React from "react";
import { Card, Tag, Space, Typography, Avatar, Button, Tooltip } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import type { IPatient } from "../../redux/slice/patientSlice";
import dayjs from "dayjs";

const { Text, Paragraph } = Typography;

interface PatientCardProps {
  patient: IPatient;
  onViewDetails: (patient: IPatient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewDetails }) => {
  const age = patient.dob ? dayjs().diff(dayjs(patient.dob), "year") : null;

  return (
    <Card
      hoverable
      className="patient-card"
      actions={[
        <Tooltip key="view" title="Xem chi tiết">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(patient)}
          >
            Chi tiết
          </Button>
        </Tooltip>,
      ]}
    >
      <Card.Meta
        avatar={
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={patient.avatar}
            style={{ backgroundColor: "#1890ff" }}
          />
        }
        title={
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 16 }}>
              {patient.name}
            </Text>
            {age && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {age} tuổi • {patient.gender === "male" ? "Nam" : patient.gender === "female" ? "Nữ" : "Khác"}
              </Text>
            )}
          </Space>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: "100%", marginTop: 8 }}>
            {patient.phone && (
              <Space size="small">
                <PhoneOutlined style={{ color: "#1890ff" }} />
                <Text>{patient.phone}</Text>
              </Space>
            )}
            {patient.email && (
              <Space size="small">
                <MailOutlined style={{ color: "#1890ff" }} />
                <Text ellipsis style={{ maxWidth: 200 }}>
                  {patient.email}
                </Text>
              </Space>
            )}
            {patient.lastVisit && (
              <Space size="small">
                <CalendarOutlined style={{ color: "#52c41a" }} />
                <Text type="secondary">
                  Khám lần cuối: {dayjs(patient.lastVisit).format("DD/MM/YYYY")}
                </Text>
              </Space>
            )}
            {patient.totalVisits !== undefined && (
              <Space size="small">
                <HeartOutlined style={{ color: "#eb2f96" }} />
                <Text type="secondary">Tổng số lần khám: {patient.totalVisits}</Text>
              </Space>
            )}
            {patient.medicalHistory && patient.medicalHistory.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Tiền sử:
                </Text>
                <div style={{ marginTop: 4 }}>
                  {patient.medicalHistory.slice(0, 2).map((history, idx) => (
                    <Tag key={idx} color="orange" style={{ marginBottom: 4 }}>
                      {history}
                    </Tag>
                  ))}
                  {patient.medicalHistory.length > 2 && (
                    <Tag>+{patient.medicalHistory.length - 2}</Tag>
                  )}
                </div>
              </div>
            )}
            {patient.notes && (
              <Paragraph
                ellipsis={{ rows: 2 }}
                type="secondary"
                style={{ marginTop: 8, marginBottom: 0, fontSize: 12 }}
              >
                Ghi chú: {patient.notes}
              </Paragraph>
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default PatientCard;
