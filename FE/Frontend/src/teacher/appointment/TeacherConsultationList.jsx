import { NavLink } from "react-router-dom";
import styles from "./TeacherConsultationList.module.scss";

const TeacherConsultationList = () => {
  return (
    <div className={styles.consultationlistContainer}>
      <div className={styles.classNavbar}>
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
      </div>
      hello
    </div>
  );
};

export default TeacherConsultationList;