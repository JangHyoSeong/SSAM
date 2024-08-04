import { NavLink, useLocation } from "react-router-dom";
import SSAM from "../../assets/SSAM.png";
import styles from "./MainNavbar.module.scss";

const MainNavbar = () => {
  const location = useLocation();

  return (
    // role이 teacher인지 parents인지에 따라서 `${role}path`로 라우팅되도록.
    <div className={styles.navbarArray}>
      <NavLink to="/">
        <img src={SSAM} className={styles.logo} alt="Logo" />
      </NavLink>
      <div className={styles.menuArray}>
        <NavLink
          to="/teacherclassroom"
          className={
            location.pathname.startsWith("/teacherclassroom") ||
            location.pathname.startsWith("/parentsclassroom") ||
            location.pathname.startsWith("/teacherauthorization")
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
          className={
            location.pathname.startsWith("/teacherreservationmanagement") ||
            location.pathname.startsWith("/teacherconsultationlist")
              ? `${styles.navtxt} ${styles.active}`
              : styles.navtxt
          }
        >
          <h2>상담예약</h2>
        </NavLink>
      </div>
    </div>
  );
};

export default MainNavbar;
