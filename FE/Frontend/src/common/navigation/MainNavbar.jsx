import { NavLink, useLocation } from "react-router-dom";
import useUserInitialStore from "../../store/UserInitialStore";
import SSAM from "../../assets/SSAM.png";
import styles from "./MainNavbar.module.scss";

const MainNavbar = () => {
  const location = useLocation();
  const { userInitialData } = useUserInitialStore((state) => ({
    userInitialData: state.userInitialData,
  }));

  const rolePath = userInitialData?.role === "TEACHER" ? "teacher" : "student";

  return (
    <div className={styles.navbarArray}>
      <NavLink to={`/${rolePath}subpage`}>
        <img src={SSAM} className={styles.logo} alt="Logo" />
      </NavLink>
      <div className={styles.menuArray}>
        <NavLink
          to={`/${rolePath}classroom`}
          className={
            location.pathname.startsWith(`/${rolePath}classroom`) ||
            location.pathname.startsWith(`/${rolePath}authorization`)
              ? `${styles.navtxt} ${styles.active}`
              : styles.navtxt
          }
        >
          <h2>학급정보</h2>
        </NavLink>
        <NavLink
          to={`/${rolePath}question`}
          className={({ isActive }) =>
            isActive ? `${styles.navtxt} ${styles.active}` : styles.navtxt
          }
        >
          <h2>문의사항</h2>
        </NavLink>
        <NavLink
          to={`/${rolePath}reservationmanagement`}
          className={
            location.pathname.startsWith(`/${rolePath}reservationmanagement`) ||
            location.pathname.startsWith(`/${rolePath}consultationlist`)
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
