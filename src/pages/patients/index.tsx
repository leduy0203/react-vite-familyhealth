import React from "react";
import { Table } from "antd";

const mockPatients = [
  { id: "p1", name: "Nguyễn Văn A", age: 34, phone: "0123456789" },
  { id: "p2", name: "Trần Thị B", age: 28, phone: "0987654321" },
];

const PatientsPage: React.FC = () => {
  const columns = [
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Tuổi", dataIndex: "age", key: "age" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2>Danh sách bệnh nhân</h2>
      </div>
      <Table rowKey="id" dataSource={mockPatients} columns={columns} />
    </div>
  );
};

export default PatientsPage;
