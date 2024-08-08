import { useState, useEffect } from "react";
import styles from "./TeacherStudentDetail.module.scss";
import DefaultStudentImage from "../../../assets/student.png"; // 기본 이미지 파일 경로를 정확히 설정하세요
import { fetchStudentDetail } from "../../../apis/stub/47-49 학생관리/apiStudentDetail";
import { fetchStudentDelete } from "../../../apis/stub/47-49 학생관리/apiStudentDelete"; // 추가

const TeacherStudentDetail = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadStudentDetail = async () => {
      try {
        console.log("상세에서 불러오기 성공 studentId:", studentId); // studentId 확인
        const studentDetail = await fetchStudentDetail(studentId.studentId);
        setStudent(studentDetail);
      } catch (error) {
        console.error("학생 상세 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    loadStudentDetail();
  }, [studentId]);

  const handleDelete = async () => {
    try {
      const result = await fetchStudentDelete(studentId.studentId);
      console.log("Delete response:", result);
      onBack(); // 성공적으로 삭제한 후 뒤로가기 또는 삭제를 반영하기 위해 페이지 새로고침 등의 액션
    } catch (error) {
      console.error("학생 삭제에 실패했습니다.", error);
    }
  };

  return (
    <div className={styles.studentDetail}>
      {student ? (
        <>
          <div className={styles.header}></div>
          <div className={styles.buttons}>
            <button className={styles.backButton} onClick={onBack}>
              뒤로가기
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              삭제
            </button>
          </div>

          <div className={styles.studentDetailBox}>
            <div className={styles.studentPhoto}>
              <img
                src={student.studentImage || DefaultStudentImage}
                alt="Student"
              />
            </div>
            <div className={styles.studentInfo}>
              <h3>이름: {student.name}</h3>
              <p>생일: {student.birth}</p>
            </div>
          </div>
          <div className={styles.historyBox}>
            <h3>상담 이력</h3>
            {student.consultList && student.consultList.length > 0 ? (
              student.consultList.map((consult, index) => (
                <p key={index}>{consult}</p>
              ))
            ) : (
              <p>아직 상담 내역이 없습니다</p>
            )}
          </div>
          <div className={styles.summaryBox}>
            <h3>상담 요약 보고서</h3>
            <p>상담 요약 보고서가 여기에 표시됩니다.</p>
          </div>
        </>
      ) : (
        <p>학생을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default TeacherStudentDetail;
