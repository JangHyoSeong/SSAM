import { useState, useEffect } from "react";
import styles from "./TeacherStudentDetail.module.scss";
import DefaultStudentImage from "../../../assets/student.png";
import { fetchStudentDetail } from "../../../apis/stub/47-49 학생관리/apiStudentDetail";
import TeacherStudentDelete from "./TeacherStudentDelete";
import { fetchTeacherConsult } from "../../../apis/stub/55-59 상담/apiTeacherConsult";

const TeacherStudentDetail = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [consultHistory, setConsultHistory] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadStudentDetail = async () => {
      try {
        console.log("학생 ID로 상세 정보 로드 중:", studentId);
        const studentDetail = await fetchStudentDetail(studentId.studentId);
        setStudent(studentDetail);

        // 상담 이력도 로드
        const consultResponse = await fetchTeacherConsult();
        console.log("Consult Response:", consultResponse); // 응답 데이터 확인

        // studentId와 일치하고 상태가 DONE인 상담 이력 필터링
        const matchedConsults = consultResponse
          .filter(
            (consult) =>
              consult.studentId === studentId.studentId &&
              consult.status === "DONE"
          )
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // startTime 기준 내림차순 정렬

        setConsultHistory(matchedConsults);
      } catch (error) {
        console.error("학생 상세 정보 또는 상담 이력 로드 실패.", error);
      }
    };

    loadStudentDetail();
  }, [studentId]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateTimeString) => {
    return dateTimeString.split("T")[0]; // '2024-08-14T14:00:00' -> '2024-08-14'
  };

  const formatTimeRange = (startTime, endTime) => {
    const start = startTime.split("T")[1].substring(0, 5); // '14:00'
    const end = endTime.split("T")[1].substring(0, 5); // '14:20'
    return `${start} ~ ${end}`;
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
              <img
                src={student.studentImage || DefaultStudentImage}
                alt="학생"
              />
            </div>
            <div className={styles.studentInfo}>
              <h3>이름: {student.name}</h3>
              <p>생일: {student.birth}</p>
            </div>
          </div>

          <div className={styles.historyBox}>
            <table className={styles.consultTable}>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>주제</th>
                  <th>내용</th>
                </tr>
              </thead>
              <tbody>
                {consultHistory.length > 0 ? (
                  consultHistory.map((consult, index) => (
                    <tr key={index}>
                      <td>{formatDate(consult.startTime)}</td>
                      <td>{consult.topic}</td>
                      <td>{consult.description || "설명 없음"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">상담 이력이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
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
