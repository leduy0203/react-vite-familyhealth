import React, { useState } from "react";
import { Table, Button, Space, Tag, Card, Input, Select, Row, Col } from "antd";
import { SearchOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Fake data: danh sách bệnh nhân đã từng khám với bác sĩ
const mockPatients = [
  {
    id: 1,
    fullname: "Nguyễn Văn A",
    id_card: "001234567890",
    address: "123 Lê Lợi, Q.1, TP.HCM",
    gender: "MALE",
    date_of_birth: "1990-01-01",
    email: "nguyenvana@gmail.com",
    bhyt: "123456789012",
    relation: "CHU_HO",
    numAppointments: 5,
  },
  {
    id: 2,
    fullname: "Trần Thị B",
    id_card: "009876543210",
    address: "456 Nguyễn Trãi, Q.5, TP.HCM",
    gender: "FEMALE",
    date_of_birth: "1985-05-12",
    email: "tranthib@gmail.com",
    bhyt: "098765432109",
    relation: "VO",
    numAppointments: 3,
  },
  {
    id: 3,
    fullname: "Lê Minh C",
    id_card: "001122334455",
    address: "789 Võ Văn Tần, Q.3, TP.HCM",
    gender: "MALE",
    date_of_birth: "2000-08-20",
    email: "leminhc@gmail.com",
    bhyt: "",
    relation: "CON",
    numAppointments: 2,
  },
  {
    id: 4,
    fullname: "Phạm Thị D",
    id_card: "005544332211",
    address: "321 Hai Bà Trưng, Q.1, TP.HCM",
    gender: "FEMALE",
    date_of_birth: "1995-03-15",
    email: "phamthid@gmail.com",
    bhyt: "112233445566",
    relation: "CHU_HO",
    numAppointments: 8,
  },
];

const genderMap: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

const relationMap: Record<string, string> = {
  CHU_HO: "Chủ hộ",
  VO: "Vợ",
  CHONG: "Chồng",
  CON: "Con",
};

const DoctorPatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState<string | undefined>(undefined);

  const filteredData = mockPatients.filter((p) => {
    const matchSearch = p.fullname.toLowerCase().includes(searchText.toLowerCase()) || p.id_card.includes(searchText);
    const matchGender = !genderFilter || p.gender === genderFilter;
    return matchSearch && matchGender;
  });

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    { title: "CCCD", dataIndex: "id_card", key: "id_card" },
    { title: "Ngày sinh", dataIndex: "date_of_birth", key: "date_of_birth" },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (g: string) => <Tag color={g === "MALE" ? "blue" : "pink"}>{genderMap[g]}</Tag>,
    },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ellipsis: true },
    { title: "BHYT", dataIndex: "bhyt", key: "bhyt", render: (v: string) => v || <Tag>Chưa có</Tag> },
    { title: "Quan hệ", dataIndex: "relation", key: "relation", render: (r: string) => <Tag color="green">{relationMap[r]}</Tag> },
    {
      title: "Số lần khám",
      dataIndex: "numAppointments",
      key: "numAppointments",
      render: (n: number) => <Tag color="purple">{n} lần</Tag>,
      sorter: (a: any, b: any) => a.numAppointments - b.numAppointments,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 150,
      render: (_: any, record: any) => (
        <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/doctor/patient-history/${record.id}`)}>
          Xem lịch sử
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <Space style={{ fontSize: 20, fontWeight: 600 }}>
            <UserOutlined style={{ color: "#1890ff" }} />
            Danh sách bệnh nhân
          </Space>
        }
        extra={<Tag color="blue">{filteredData.length} bệnh nhân</Tag>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm theo tên hoặc CCCD"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo giới tính"
              style={{ width: "100%" }}
              value={genderFilter}
              onChange={setGenderFilter}
              allowClear
            >
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          bordered
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Tổng ${total} bệnh nhân` }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default DoctorPatientsList;
