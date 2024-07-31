import { NavLink, useLocation } from "react-router-dom";
import SSAM from "../assets/SSAM.png";
import styles from "./MainNavbar.module.scss";

const MainNavbar = () => {
  const location = useLocation();

  return (
    <div className={styles.navbarArray}>
      <NavLink to="/">
        <img src={SSAM} className={styles.logo} alt="Logo" />
      </NavLink>
      <div className={styles.menuArray}>
        <NavLink
          to="/teacherclassroom"
          className={
            location.pathname.startsWith("/teacherclassroom") ||
            location.pathname.startsWith("/parentsclassroom")
              ? `${styles.navtxt} ${styles.active}`
              : styles.navtxt
          }
        >
          <h2>학급정보</h2>
        </NavLink>
        <NavLink
          to="/teacherquestion"
          className={({ isActive }) =>
            isActive ? `${styles.navtxt} ${styles.active}` : styles.navtxt
          }
        >
          <h2>문의사항</h2>
        </NavLink>
        <NavLink
          to="/teacherreservationmanagement"
          className={({ isActive }) =>
            isActive ? `${styles.navtxt} ${styles.active}` : styles.navtxt
          }
        >
          <h2>상담예약</h2>
        </NavLink>
      </div>
    </div>
  );
};

export default MainNavbar;
