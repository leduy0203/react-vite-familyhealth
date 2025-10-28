import React, { useEffect } from "react";
import { Table } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPrescriptions } from "../../redux/slice/prescriptionSlice";

const PrescriptionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.prescription);

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  const columns = [
    { title: "Mã", dataIndex: "id", key: "id" },
    {
      title: "Thuốc",
      dataIndex: ["meds"],
      key: "meds",
      render: (meds: any[]) => meds?.map((m) => m.name).join(", "),
    },
    { title: "Ngày cấp", dataIndex: "issuedDate", key: "issuedDate" },
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
        <h2>Đơn thuốc</h2>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
      />
    </div>
  );
};

export default PrescriptionsPage;
