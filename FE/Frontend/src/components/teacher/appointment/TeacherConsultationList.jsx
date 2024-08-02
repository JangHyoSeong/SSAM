import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";  // NavLink 컴포넌트를 import
import styles from "./TeacherConsultationList.module.scss";

const ConsultationItem = ({ date, time, studentName, subject, content }) => {
  return (
    <div className={styles.consultationRow}>
      <div className={styles.cell}>{date}</div>
      <div className={styles.cellSmall}>{time}</div>
      <div className={styles.cellSmall}>{studentName}</div>
      <div className={styles.cellMedium}>{subject}</div>
      <div className={styles.cellLarge}>{content}</div>
      <div className={styles.cellButtons}>
        <button className={styles.approveButton}>승인</button>
        <button className={styles.editButton}>거절</button>
      </div>
    </div>
  );
};

ConsultationItem.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

const TeacherConsultationList = () => {
  const consultations = [
    {
      date: "2024-07-15",
      time: "15:00 ~ 15:20",
      studentName: "박범준",
      subject: "학교 생활",
      content: "우리 아이가 잘 지내고 있는지 궁금해요",
    },
    {
      date: "2024-07-16",
      time: "16:00 ~ 16:20",
      studentName: "김철수",
      subject: "학교 생활",
      content: "우리 아이가 잘 지내고 있는지 궁금해요",
    },
  ];

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
          <h3 className={styles.cellHeader}>날짜</h3>
          <h3 className={styles.cellHeaderSmall}>시간</h3>
          <h3 className={styles.cellHeaderSmall}>이름</h3>
          <h3 className={styles.cellHeaderMedium}>주제</h3>
          <h3 className={styles.cellHeaderLarge}>내용</h3>
          <h3 className={styles.cellHeaderButtons}>관리</h3>
        </header>
        {consultations.map((consultation, index) => (
          <ConsultationItem
            key={index}
            date={consultation.date}
            time={consultation.time}
            studentName={consultation.studentName}
            subject={consultation.subject}
            content={consultation.content}
          />
        ))}
      </section>
    </div>
  );
};

export default TeacherConsultationList;
