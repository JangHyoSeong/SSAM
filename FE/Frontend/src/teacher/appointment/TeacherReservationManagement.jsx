import { NavLink } from "react-router-dom";
import TeacherCalendar from "./TeacherCalendar";
import TeacherReservationList from "./TeacherReservationList";
import styles from "./TeacherReservationManagement.module.scss";

const TeacherAppointment = () => {
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
        <TeacherCalendar />
        <TeacherReservationList />
      </section>
    </div>
  );
};

export default TeacherAppointment;
