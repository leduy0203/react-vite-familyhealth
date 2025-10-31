import React from "react";
import { Card, Descriptions, Tag, Space, Typography, Divider, Timeline, Empty } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { IMedicalRecord } from "../../../types/health";
import dayjs from "dayjs";

const { Text, Title } = Typography;

interface RecordDetailCardProps {
  record: IMedicalRecord;
}

const RecordDetailCard: React.FC<RecordDetailCardProps> = ({ record }) => {
  const getStatusTag = (status?: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      new: { color: "cyan", text: "Mới" },
      transferred: { color: "blue", text: "Đã chuyển" },
      viewed: { color: "geekblue", text: "Đã xem" },
      appointment_suggested: { color: "purple", text: "Đề xuất hẹn" },
      prescribed: { color: "green", text: "Đã kê đơn" },
      closed: { color: "default", text: "Đã đóng" },
      rejected: { color: "red", text: "Từ chối" },
    };
    const config = statusConfig[status || "new"] || {
      color: "default",
      text: status || "N/A",
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Basic Info */}
        <div>
          <Title level={5}>
            <FileTextOutlined /> Thông tin hồ sơ
          </Title>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Mã hồ sơ" span={2}>
              <Text code>{record.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<Space><UserOutlined />Bệnh nhân</Space>}>
              <Text strong>{record.patientName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(record.status)}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><CalendarOutlined />Ngày tạo</Space>}>
              {record.createdAt
                ? dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {record.updatedAt
                ? dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")
                : "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Summary */}
        <div>
          <Title level={5}>Tóm tắt bệnh án</Title>
          <Card size="small" style={{ background: "#fafafa" }}>
            <Text>{record.summary || "Chưa có thông tin"}</Text>
          </Card>
        </div>

        {/* Files */}
        {record.files && record.files.length > 0 && (
          <div>
            <Title level={5}>Tài liệu đính kèm</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              {record.files.map((file) => (
                <Card key={file.id} size="small">
                  <Space>
                    <FileTextOutlined />
                    <Text>{file.name}</Text>
                  </Space>
                </Card>
              ))}
            </Space>
          </div>
        )}

        <Divider />

        {/* Doctor Notes */}
        <div>
          <Title level={5}>
            <ClockCircleOutlined /> Ghi chú của bác sĩ
          </Title>
          {record.doctorNotes && record.doctorNotes.length > 0 ? (
            <Timeline
              items={record.doctorNotes.map((note) => ({
                children: (
                  <div>
                    <Text type="secondary">
                      {dayjs(note.at).format("DD/MM/YYYY HH:mm")} - Bác sĩ: {note.by}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Text>{note.note}</Text>
                    </div>
                  </div>
                ),
              }))}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có ghi chú từ bác sĩ"
            />
          )}
        </div>

        {/* Linked Items */}
        {(record.linkedAppointmentId || record.linkedPrescriptionId) && (
          <>
            <Divider />
            <div>
              <Title level={5}>Liên kết</Title>
              <Space direction="vertical">
                {record.linkedAppointmentId && (
                  <Text>
                    <CalendarOutlined /> Lịch hẹn: <Text code>{record.linkedAppointmentId}</Text>
                  </Text>
                )}
                {record.linkedPrescriptionId && (
                  <Text>
                    <FileTextOutlined /> Đơn thuốc:{" "}
                    <Text code>{record.linkedPrescriptionId}</Text>
                  </Text>
                )}
              </Space>
            </div>
          </>
        )}
      </Space>
    </Card>
  );
};

export default RecordDetailCard;
