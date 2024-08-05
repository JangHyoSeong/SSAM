import styles from "./TeacherStudentDetail.module.scss";
import StudentImage from "../../../assets/student.png"; // 이미지 파일 경로를 정확히 설정하세요
import students from "./students.jsx";

const TeacherStudentDetail = ({ studentId, onBack }) => {
  const student = students.find((student) => student.id === studentId);

  return (
    <div className={styles.studentDetail}>
      {student ? (
        <>
          <div className={styles.studentDetailBox}>
            <div className={styles.studentPhoto}>
              <img src={StudentImage} alt="Student" />
            </div>
            <h3>이름: {student.name}</h3>
            <p>생일: {student.birth}</p>
          </div>
          <div className={styles.historyBox}>
            <h3>상담 이력</h3>
            <p>1. 2024.07.01 - 교우 관계</p>
            <p>2. 2024.06.01 - 학교 생활</p>
          </div>
          <div className={styles.summaryBox}>
            <h3>상담 요약 보고서</h3>
            <p>상담 요약 보고서가 여기에 표시됩니다.</p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.backButton} onClick={onBack}>
              뒤로가기
            </button>
          </div>
        </>
      ) : (
        <p>학생을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default TeacherStudentDetail;
