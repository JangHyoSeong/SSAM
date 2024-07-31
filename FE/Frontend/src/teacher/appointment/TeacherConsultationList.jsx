import { NavLink } from "react-router-dom";
import styles from "./TeacherConsultationList.module.scss";

const TeacherConsultationList = () => {
  return (
    <div className={styles.consultationlistContainer}>
      <nav className={styles.classNavbar}>
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
      <section className={styles.consultationSection}>
        <header className={styles.headerRow}>
          <h3>상담 날짜</h3>
          <h3>상담 시간</h3>
          <h3>학생 이름</h3>
          <h3>주제</h3>
          <h3>내용</h3>
        </header>
        <article className={styles.consultationRow}>
          <div>2024-07-15</div>
          <div>15:00 ~ 15:20</div>
          <div>박범준</div>
          <div>학교 생활</div>
          <div>우리 아이가 잘 지내고 있는지 궁금해요</div>
          <button className={styles.approveButton}>승인</button>
          <button className={styles.editButton}>거절</button>
        </article>
      </section>
    </div>
  );
};

export default TeacherConsultationList;
