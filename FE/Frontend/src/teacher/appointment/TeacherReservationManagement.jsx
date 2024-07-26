import { useState } from "react";
import { NavLink } from "react-router-dom";
import TeacherCalendar from "./TeacherCalendar";
import TeacherReservationList from "./TeacherReservationList";
import styles from "./TeacherReservationManagement.module.scss";

const TeacherAppointment = () => {
  const [selectedDate, setSelectedDate] = useState("날짜를 선택해 주세요");

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <nav className={styles.container}>
        <NavLink
          to="/teacherreservationmanagement"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          예약 관리
        </NavLink>
        <NavLink
          to="/teacherconsultationlist"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          상담 목록
        </NavLink>
      </nav>
      <section className={styles.classNavbar}>
        <TeacherCalendar onDateSelect={handleDateSelect} />
        <TeacherReservationList selectedDate={selectedDate} />
      </section>
    </div>
  );
};

export default TeacherAppointment;
