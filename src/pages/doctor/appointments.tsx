import React, { useEffect, useState } from "react";
import { Calendar, Badge, Button, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchAppointments,
  createAppointment,
} from "../../redux/slice/appointmentSlice";
import AppointmentForm from "../../components/appointments/AppointmentForm";
import type { IAppointment } from "../../types/health";
import dayjs from "dayjs";

const DoctorAppointments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((s) => s.appointment);
  const [modalOpen, setModalOpen] = useState(false);
  const [initial, setInitial] = useState<Partial<IAppointment> | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const dateCellRender = (value: dayjs.Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const items = list.filter(
      (a) => a.datetime && a.datetime.startsWith(dateStr)
    );
    return (
      <ul className="events">
        {items.map((item) => (
          <li key={item.id}>
            <Badge
              status={
                item.status === "pending"
                  ? "warning"
                  : item.status === "confirmed"
                  ? "success"
                  : "default"
              }
              text={`${dayjs(item.datetime).format("HH:mm")} ${
                item.patientName || ""
              }`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const openCreateAt = (date?: dayjs.Dayjs) => {
    setInitial({ datetime: date ? date.toISOString() : undefined });
    setModalOpen(true);
  };

  const handleCreate = async (payload: Partial<IAppointment>) => {
    try {
      await dispatch(createAppointment(payload)).unwrap();
      message.success("Tạo lịch hẹn thành công");
      setModalOpen(false);
    } catch (err) {
      message.error("Tạo thất bại");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2>Lịch bác sĩ</h2>
        <Button type="primary" onClick={() => openCreateAt()}>
          Tạo lịch
        </Button>
      </div>

      <Calendar dateCellRender={dateCellRender} />

      <AppointmentForm
        visible={modalOpen}
        initial={initial}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default DoctorAppointments;
