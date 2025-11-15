import React from "react";
import { Modal, Space, Tag, Typography, Divider, Row, Col } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EXPERTISE_LABELS, GENDER_LABELS } from "../../../constants/expertise";
import type { IDoctorNew } from "../../../types/doctor.types";

const { Text } = Typography;

interface DoctorDetailModalProps {
  open: boolean;
  doctor: IDoctorNew | null;
  onClose: () => void;
}

const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  open,
  doctor,
  onClose,
}) => {
  if (!doctor) return null;

  return (
    <Modal
      title={
        <Space>
          <EyeOutlined />
          <span>Chi tiết bác sĩ</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div style={{ padding: "20px 0" }}>
        {/* Thông tin cơ bản */}
        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ fontSize: 15, color: "#1890ff" }}>
            👤 Thông tin cơ bản
          </Text>
          <Divider style={{ margin: "12px 0" }} />
          <Row gutter={[16, 12]}>
            <Col span={12}>
              <Text type="secondary">ID:</Text>
              <br />
              <Text strong>{doctor.id}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Họ và tên:</Text>
              <br />
              <Text strong>{doctor.fullname}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Giới tính:</Text>
              <br />
              <Tag color={doctor.gender === "MALE" ? "blue" : "pink"}>
                {GENDER_LABELS[doctor.gender as keyof typeof GENDER_LABELS]}
              </Tag>
            </Col>
            <Col span={12}>
              <Text type="secondary">Ngày sinh:</Text>
              <br />
              <Text>
                {doctor.dateOfBirth
                  ? dayjs(doctor.dateOfBirth).format("DD/MM/YYYY")
                  : "-"}
              </Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">CMND/CCCD:</Text>
              <br />
              <Text>{doctor.idCard || "-"}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Email:</Text>
              <br />
              <Text copyable>{doctor.email}</Text>
            </Col>
          </Row>
        </div>

        {/* Địa chỉ */}
        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ fontSize: 15, color: "#1890ff" }}>
            📍 Địa chỉ
          </Text>
          <Divider style={{ margin: "12px 0" }} />
          <Text>{doctor.address}</Text>
        </div>

        {/* Thông tin chuyên môn */}
        <div>
          <Text strong style={{ fontSize: 15, color: "#1890ff" }}>
            🩺 Thông tin chuyên môn
          </Text>
          <Divider style={{ margin: "12px 0" }} />
          <Row gutter={[16, 12]}>
            <Col span={24}>
              <Text type="secondary">Chuyên khoa:</Text>
              <br />
              <Tag color="cyan" style={{ marginTop: 4 }}>
                {EXPERTISE_LABELS[
                  doctor.expertise as keyof typeof EXPERTISE_LABELS
                ] || doctor.expertise}
              </Tag>
            </Col>
            <Col span={24}>
              <Text type="secondary">Tiểu sử nghề nghiệp:</Text>
              <br />
              <Text style={{ display: "block", marginTop: 8 }}>
                {doctor.bio}
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default DoctorDetailModal;
