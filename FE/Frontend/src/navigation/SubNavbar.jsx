import { NavLink } from "react-router-dom";
import styles from "./SubNavbar.module.scss";
import alram from "../assets/alram.png";
import AlramModal from "./AlramModal";
import { useState } from "react";

const SubNavbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.navArray}>
      <img src={alram} className={styles.alram} onClick={toggleModal} />
      <NavLink to="/teacherupdate" className={styles.nav}>
        회원정보
      </NavLink>
      |<p>로그아웃</p>
      {isModalOpen && <AlramModal />}
    </div>
  );
};

export default SubNavbar;
