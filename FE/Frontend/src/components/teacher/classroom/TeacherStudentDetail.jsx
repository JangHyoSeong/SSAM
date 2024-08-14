import { useState, useEffect } from "react";
import styles from "./TeacherStudentDetail.module.scss";
import DefaultStudentImage from "../../../assets/student.png";
import { fetchStudentDetail } from "../../../apis/stub/47-49 학생관리/apiStudentDetail";
import TeacherStudentDelete from "./TeacherStudentDelete";
import { fetchTeacherConsult } from "../../../apis/stub/55-59 상담/apiTeacherConsult";
import { fetchConsultDetail } from "../../../apis/stub/72-75 상담요약/apiConsultDetail";

const TeacherStudentDetail = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [consultHistory, setConsultHistory] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consultDetail, setConsultDetail] = useState(null);
  const [error, setError] = useState(null);

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

  const handleConsultClick = async (consultId) => {
    try {
      setIsLoading(true); // 로딩 시작
      setError(null); // 에러 메시지 초기화
      console.log(`Fetching details for consultId: ${consultId}`);
      const detail = await fetchConsultDetail(consultId);
      console.log("Fetched consult detail:", detail); // 전체 detail 객체 출력

      const summaryData = {
        topic: detail.topic || "없음",
        profanityCount: detail.profanityCount || "없음",
        profanityLevel: detail.profanityLevel || "없음",
        keyPoint: detail.keyPoint || "없음",
        parentConcern: detail.parentConcern || "없음",
        teacherRecommendation: detail.teacherRecommendation || "없음",
      };

      console.log("Translated summary data:", summaryData);

      setConsultDetail(summaryData);
    } catch (error) {
      console.error("상담 상세 정보를 불러오는 데 실패했습니다.", error);
      setError(
        "상담 요약 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setError(null); // 에러 모달 닫기
  };

  const formatDate = (dateTimeString) => {
    return dateTimeString.split("T")[0]; // '2024-08-14T14:00:00' -> '2024-08-14'
  };

  const Modal = ({ message, onClose }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>{message}</p>
          <button onClick={onClose}>확인</button>
        </div>
      </div>
    );
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
            <h3>상담 내역</h3>
            {consultHistory.length > 0 ? (
              <table className={styles.consultTable}>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>주제</th>
                    <th>내용</th>
                  </tr>
                </thead>
                <tbody>
                  {consultHistory.map((consult, index) => (
                    <tr
                      key={index}
                      onClick={() => handleConsultClick(consult.consultId)}
                    >
                      <td>{formatDate(consult.startTime)}</td>
                      <td>{consult.topic}</td>
                      <td>{consult.description || "설명 없음"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noConsultHistory}>상담 이력이 없습니다.</p>
            )}
          </div>

          <div className={styles.summaryBox}>
            <h3>상담 요약 보고서</h3>
            {consultDetail ? (
              <>
                <p>
                  <strong>주제:</strong> {consultDetail.topic}
                </p>
                <p>
                  <strong>공격 발언 횟수:</strong>{" "}
                  {consultDetail.profanityCount}
                </p>
                <p>
                  <strong>공격 발언 수위:</strong>{" "}
                  {consultDetail.profanityLevel}
                </p>
                <p>
                  <strong>주요 내용:</strong> {consultDetail.keyPoint}
                </p>
                <p>
                  <strong>학부모:</strong> {consultDetail.parentConcern}
                </p>
                <p>
                  <strong>선생님:</strong> {consultDetail.teacherRecommendation}
                </p>
              </>
            ) : (
              <p>상담 요약 보고서가 여기에 표시됩니다.</p>
            )}
          </div>
        </>
      ) : (
        <p>학생을 찾을 수 없습니다.</p>
      )}

      {error && <Modal message={error} onClose={handleCloseModal} />}
    </div>
  );
};

export default TeacherStudentDetail;
