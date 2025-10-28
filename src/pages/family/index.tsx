import React, { useEffect } from "react";
import { Table, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchFamily } from "../../redux/slice/familySlice";

const FamilyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { members, loading } = useAppSelector((s) => s.family);

  useEffect(() => {
    dispatch(fetchFamily());
  }, [dispatch]);

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Quan hệ", dataIndex: "relation", key: "relation" },
    { title: "Ngày sinh", dataIndex: "dob", key: "dob" },
    { title: "Tình trạng", dataIndex: "healthStatus", key: "healthStatus" },
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
        <h2>Thành viên gia đình</h2>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={members}
        loading={loading}
      />
    </div>
  );
};

export default FamilyPage;
