import { useState, useEffect } from "react";
import styles from "./TeacherStudentDetail.module.scss";
import StudentImage from "../../../assets/student.png"; // 이미지 파일 경로를 정확히 설정하세요
import { fetchStudentDetail } from "../../../apis/stub/47-49 학생관리/apiStudentDetail";

const TeacherStudentDetail = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadStudentDetail = async () => {
      try {
        console.log("Student ID in TeacherStudentDetail:", studentId); // studentId 확인
        const studentDetail = await fetchStudentDetail(studentId);
        setStudent(studentDetail);
      } catch (error) {
        console.error("학생 상세 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    loadStudentDetail();
  }, [studentId]);

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
            {/* 상담 이력을 여기에 표시합니다. 예시는 하드코딩으로 표시합니다. */}
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
