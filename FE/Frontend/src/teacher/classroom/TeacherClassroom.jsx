import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherClassroom.module.scss';
import TeacherStudent from './TeacherStudent';
import TeacherStudentDetail from './TeacherStudentDetail';
import ClassImage from '../../assets/background.png'; // 이미지 파일 경로를 정확히 설정하세요

const TeacherClassroom = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const navigate = useNavigate();

  const handleAuthorizationClick = () => {
    navigate('/teacherauthorization');
  };

  return (
    <div className={`${styles.classInfoContainer} ${isActive ? styles.active : ''}`}>
      <div className={styles.classNavbar}>
<<<<<<< HEAD
        <NavLink
          to="/teacherclassroom"
          className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          onClick={() => setIsActive(true)}
        >
          학급 관리
        </NavLink>
        <NavLink
          to="/teacherauthorization"
          className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}
          onClick={() => setIsActive(false)}
        >
=======
        <div
          className={`${styles.navItem} ${selectedStudentId === null ? styles.active : ''}`}
          onClick={() => setSelectedStudentId(null)}
        >
          학급 관리
        </div>
        <div className={styles.navItem} onClick={handleAuthorizationClick}>
>>>>>>> FE
          승인 관리
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={ClassImage} alt="Class Management" className={styles.classImage} />
      </div>
      <div className={styles.infoBoxes}>
        <div className={styles.noticeBox}>
          <h3>상담 가능 시간</h3>
          <p>14:00 ~ 18:00</p>
          <p>준비물: 물감, 물통, 붓</p>
        </div>
        <div className={styles.classInfoBox}>
          <h3>자라나는 새싹, 돋아나는 희망</h3>
          <p>삼성초등학교 1학년 2반</p>
        </div>
        <div className={styles.inquiryBox}>
          <h3>문의사항</h3>
          <p>점심메뉴가 뭔가요: 운영자</p>
          <p>교무실 전화번호: 박범준</p>
          <p>소풍 날짜 언제죠: 조성인</p>
        </div>
      </div>
<<<<<<< HEAD
=======
      {selectedStudentId === null ? (
        <TeacherStudent onSelectStudent={setSelectedStudentId} />
      ) : (
        <TeacherStudentDetail studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />
      )}
>>>>>>> FE
    </div>
  );
};

export default TeacherClassroom;
