// import { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import styles from "./TeacherConsultationList.module.scss";
import ConsultationItem from "./ConsultationItem";
// import useConsultationStore from '../../store/consultationStore'

const TeacherConsultationList = () => {
  // 예제 데이터
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
    // 백 연결할경우
    // const { consultations, fetchConsultations } = useConsultationStore();

    // useEffect(() => {
    //   fetchConsultations(); // Fetch consultations when the component mounts
    // }, [fetchConsultations]);
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
          <h3>상담 날짜</h3>
          <h3>상담 시간</h3>
          <h3>학생 이름</h3>
          <h3>주제</h3>
          <h3>내용</h3>
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
