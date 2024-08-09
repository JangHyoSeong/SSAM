import { useState, useEffect } from "react";
import styles from "./TeacherStudentDetail.module.scss";
import DefaultStudentImage from "../../../assets/student.png";
import { fetchStudentDetail } from "../../../apis/stub/47-49 학생관리/apiStudentDetail";
import TeacherStudentDelete from "./TeacherStudentDelete"; // 경로가 맞다고 가정합니다

const TeacherStudentDetail = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadStudentDetail = async () => {
      try {
        console.log("학생 ID로 상세 정보 로드 중:", studentId);
        const studentDetail = await fetchStudentDetail(studentId.studentId);
        setStudent(studentDetail);
      } catch (error) {
        console.error("학생 상세 정보 로드 실패.", error);
      }
    };

    loadStudentDetail();
  }, [studentId]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div className={styles.studentDetail}>
      {student ? (
        <>
          <div className={styles.header}></div>
          <div className={styles.buttons}>
            <button className={styles.backButton} onClick={onBack}>
              뒤로 가기
            </button>
            <button className={styles.deleteButton} onClick={handleDeleteClick}>
              삭제
            </button>
          </div>

          <div className={styles.studentDetailBox}>
            <div className={styles.studentPhoto}>
              <img src={student.studentImage || DefaultStudentImage} alt="학생" />
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
              <p>상담 이력이 없습니다.</p>
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
      {isDeleteModalOpen && (
        <TeacherStudentDelete
          studentId={studentId}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherStudentDetail;
