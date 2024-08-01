import { useState } from 'react';
import { NavLink } from "react-router-dom";
import styles from "./TeacherSelect.module.scss";
import classroom from "../../../assets/classroom.png";
import question from "../../../assets/question.png";
import appointment from "../../../assets/appointment.png";
import ClassProduceModal from './ClassProduceModal';

const TeacherSelect = () => {
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.menuArray}>
      <hr />
      <div className={styles.inviteCodeBox}>
        <div className={styles.inviteTxtBox}>
          <h2>선생님 환영합니다</h2>
          <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
        </div>
        <button className={styles.classBtn} onClick={toggleModal}>
          학급 만들기
        </button>
        {/* Render the modal based on the state */}
        {isModalOpen && <ClassProduceModal />}
      </div>
      <div className={styles.menuBoxArray}>
        <NavLink to="/teacherclassroom" className={`${styles.menuBox} ${styles.menuBox1}`}>
          <div className={styles.menuTxt}>
            <h1>학급 정보</h1>
            <h3>우리 학급을 보여줍니다</h3>
            <div className={styles.imgArray}>
              <img src={classroom} className={styles.classroomImg} alt="classroom"/>
            </div>
          </div>
        </NavLink>
        <NavLink to="/teacherquestion" className={`${styles.menuBox} ${styles.menuBox2}`}>
          <div className={styles.menuTxt}>
            <h1>문의 사항</h1>
            <h3>문의 사항을 남겨주세요</h3>
            <div className={styles.imgArray}>
              <img src={question} className={styles.questionImg} alt="question"/>
            </div>
          </div>
        </NavLink>
        <NavLink to="/teacherappointment" className={`${styles.menuBox} ${styles.menuBox3}`}>
          <div className={styles.menuTxt}>
            <h1>상담 예약</h1>
            <h3>상담 시간을 예약하세요</h3>
            <div className={styles.imgArray}>
              <img src={appointment} className={styles.appointmentImg} alt="appointment"/>
            </div>
          </div>
        </NavLink>
      </div>
      <p className={styles.scroll}>Scroll ▽</p>
    </div>
  );
};

export default TeacherSelect;
