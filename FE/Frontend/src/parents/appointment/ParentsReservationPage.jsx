import { NavLink } from "react-router-dom";
import ParentsReservationList from "./ParentsReservationList";
import ParentsCalendar from "./ParentsCalendar";
import styles from "./ParentsReservationPage.module.scss";

const ParentsReservationPage = () => {
  return (
    <div>
      <nav className={styles.container}>
        <NavLink
          to="/parentsreservationpage"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          예약 관리
        </NavLink>
        <NavLink
          to="/parentsreservationpage"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          상담 목록
        </NavLink>
      </nav>
      <section className={styles.classNavbar}>
        <ParentsCalendar />
        <ParentsReservationList />
      </section>
    </div>
  );
};

export default ParentsReservationPage;
