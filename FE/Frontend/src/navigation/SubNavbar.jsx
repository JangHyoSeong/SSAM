import { NavLink } from "react-router-dom";
import styles from "./SubNavbar.module.scss";
import alram from "../assets/alram.png";

const SubNavbar = () => {
  return (
    <div className={styles.navArray}>
      <img src={alram} className={styles.alram}/>
      <NavLink to="/teacherupdate" className={styles.nav}>
        회원정보
      </NavLink>
      |<p>로그아웃</p>
    </div>
  );
};

export default SubNavbar;
