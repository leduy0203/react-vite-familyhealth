import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Select, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchRecords,
  createRecord,
  transferRecord,
} from "../../redux/slice/recordSlice";
import RecordForm from "../../components/records/RecordForm";
import type { IMedicalRecord } from "../../types/health";
import Access from "../../components/share/Access";

const RecordsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.record);
  const [openForm, setOpenForm] = useState(false);
  const [editItem, setEditItem] = useState<IMedicalRecord | null>(null);

  // Transfer UI state
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferRecordItem, setTransferRecordItem] =
    useState<IMedicalRecord | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  const handleAdd = () => {
    setEditItem(null);
    setOpenForm(true);
  };

  const handleEdit = (record: IMedicalRecord) => {
    setEditItem(record);
    setOpenForm(true);
  };

  const handleSave = async (values: any) => {
    try {
      if (values.id) {
        // update locally for now
        message.success("Cập nhật thành công (local)");
      } else {
        await dispatch(createRecord(values)).unwrap();
        message.success("Tạo hồ sơ thành công");
      }
      setOpenForm(false);
    } catch (err) {
      message.error("Thao tác thất bại");
    }
  };

  const openTransfer = async (r: IMedicalRecord) => {
    setTransferRecordItem(r);
    setTransferOpen(true);
    try {
      const res = await import("../../config/api");
      const docs = await res.api.getDoctors();
      setDoctors(docs.data || []);
    } catch (err) {
      setDoctors([]);
    }
  };

  const doTransfer = async () => {
    if (!transferRecordItem || !selectedDoctor) return;
    try {
      await dispatch(
        transferRecord({ id: transferRecordItem.id, doctorId: selectedDoctor })
      ).unwrap();
      message.success("Đã chuyển hồ sơ cho bác sĩ");
      setTransferOpen(false);
      setSelectedDoctor(null);
    } catch (err) {
      message.error("Chuyển thất bại");
    }
  };

  const columns = [
    { title: "Bệnh nhân", dataIndex: "patientName", key: "patientName" },
    { title: "Tóm tắt", dataIndex: "summary", key: "summary" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IMedicalRecord) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button size="small" onClick={() => openTransfer(record)}>
            Chuyển cho bác sĩ
          </Button>
        </Space>
      ),
    },
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
        <h2>Danh sách hồ sơ</h2>
        <Access permission="create_record" hideChildren>
          <Button type="primary" onClick={handleAdd}>
            Tạo hồ sơ
          </Button>
        </Access>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={list}
        columns={columns}
      />

      <RecordForm
        visible={openForm}
        onClose={() => setOpenForm(false)}
        initialValues={editItem as any}
        onSave={handleSave}
      />

      <Modal
        title={
          transferRecordItem
            ? `Chuyển hồ sơ: ${transferRecordItem.patientName}`
            : "Chuyển hồ sơ"
        }
        open={transferOpen}
        onOk={doTransfer}
        onCancel={() => setTransferOpen(false)}
      >
        <div style={{ marginBottom: 8 }}>Chọn bác sĩ để chuyển hồ sơ</div>
        <Select
          style={{ width: "100%" }}
          value={selectedDoctor}
          onChange={(v) => setSelectedDoctor(v)}
          placeholder="Chọn bác sĩ"
        >
          {doctors.map((d) => (
            <Select.Option key={d.id} value={d.id}>
              {d.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default RecordsPage;
