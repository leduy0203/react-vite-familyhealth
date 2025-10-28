import React, { useEffect } from "react";
import { Calendar, Badge } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAppointments } from "../../redux/slice/appointmentSlice";
import dayjs from "dayjs";

const DoctorAppointments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((s) => s.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const dateCellRender = (value: dayjs.Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    const items = list.filter(
      (a) => a.appointmentDate && a.appointmentDate.startsWith(dateStr)
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
              text={`${dayjs(item.appointmentDate).format("HH:mm")} ${
                item.patientName || ""
              }`}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h2>Lịch bác sĩ</h2>
      </div>

      <Calendar dateCellRender={dateCellRender} />
    </div>
  );
};

export default DoctorAppointments;
