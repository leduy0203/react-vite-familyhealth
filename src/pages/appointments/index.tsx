import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
} from "../../redux/slice/appointmentSlice";
import AppointmentForm from "../../components/appointments/AppointmentForm";
import type { IAppointment } from "../../types/health";

const AppointmentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.appointment);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Partial<IAppointment> | null>(null);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setModalVisible(true);
  };
  const openEdit = (record: IAppointment) => {
    setEditing(record);
    setModalVisible(true);
  };

  const handleSubmit = async (payload: Partial<IAppointment>) => {
    try {
      if (editing && editing.id) {
        await dispatch(updateAppointment(payload as IAppointment)).unwrap();
        message.success("Cập nhật lịch hẹn thành công");
      } else {
        await dispatch(createAppointment(payload)).unwrap();
        message.success("Tạo lịch hẹn thành công");
      }
      setModalVisible(false);
    } catch (err) {
      message.error("Thao tác thất bại");
    }
  };

  const columns = [
    { title: "Bệnh nhân", dataIndex: "patientName", key: "patientName" },
    { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
    {
      title: "Ngày giờ",
      dataIndex: "datetime",
      key: "datetime",
      render: (d: string) => new Date(d).toLocaleString(),
    },
    { title: "Lý do", dataIndex: "reason", key: "reason" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IAppointment) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Sửa
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
        <h2>Lịch hẹn</h2>
        <Button type="primary" onClick={openCreate}>
          Tạo lịch hẹn
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={loading}
      />

      <AppointmentForm
        visible={modalVisible}
        initial={editing || undefined}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AppointmentsPage;
