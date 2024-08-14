import { useState, useEffect } from "react";
import styles from "./TeacherStudentDetail.module.scss";
import DefaultStudentImage from "../../../assets/student.png";
import { fetchStudentDetail } from "../../../apis/stub/47-49 학생관리/apiStudentDetail";
import TeacherStudentDelete from "./TeacherStudentDelete";
import { fetchTeacherConsult } from "../../../apis/stub/55-59 상담/apiTeacherConsult";
import { fetchConsultDetail } from "../../../apis/stub/72-75 상담요약/apiConsultDetail";

// Topic을 한글로 변환하기 위한 매핑 객체
const topicTranslationMap = {
  FRIEND: "교우 관계",
  BULLYING: "학교 폭력",
  SCORE: "성적",
  CAREER: "진로",
  ATTITUDE: "학습 태도",
  OTHER: "기타",
};

const TeacherStudentDetail = ({ studentId, onBack }) => {
  const [student, setStudent] = useState(null);
  const [consultHistory, setConsultHistory] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consultDetail, setConsultDetail] = useState(null);
  const [error, setError] = useState(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  useEffect(() => {
    const loadStudentDetail = async () => {
      try {
        const studentDetail = await fetchStudentDetail(studentId.studentId);
        setStudent(studentDetail);

        const consultResponse = await fetchTeacherConsult();

        const matchedConsults = consultResponse
          .filter(
            (consult) =>
              consult.studentId === studentId.studentId &&
              consult.status === "DONE"
          )
          .map((consult) => ({
            ...consult,
            topic: topicTranslationMap[consult.topic] || "없음",
          }))
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        setConsultHistory(matchedConsults);
      } catch (error) {
        console.error("학생 상세 정보 또는 상담 이력 로드 실패.", error);
      }
    };

    loadStudentDetail();
  }, [studentId]);

  const handleConsultClick = async (consultId) => {
    try {
      setIsLoading(true);
      setError(null);

      const detail = await fetchConsultDetail(consultId);

      const summaryData = {
        topic: topicTranslationMap[detail.topic] || "없음",
        profanityCount: detail.profanityCount || "없음",
        profanityLevel: detail.profanityLevel || "없음",
        keyPoint: detail.keyPoint || "없음",
        parentConcern: detail.parentConcern || "없음",
        teacherRecommendation: detail.teacherRecommendation || "없음",
      };

      setConsultDetail(summaryData);
      setIsSummaryModalOpen(true); // Summary 모달을 열기
    } catch (error) {
      console.error("상담 상세 정보를 불러오는 데 실패했습니다.", error);
      setError("상담 요약 정보를\n생성 중입니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setError(null);
    setIsSummaryModalOpen(false); // Summary 모달을 닫기
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const Modal = ({ message, onClose }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent} style={{ lineHeight: "0.8" }}>
          {message.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <button onClick={onClose}>확인</button>
        </div>
      </div>
    );
  };

  const SummaryModal = ({ detail, onClose }) => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3>상담 요약 보고서</h3>
          <p>
            <strong>주제:</strong> {detail.topic}
          </p>
          <p>
            <strong>공격 발언 횟수:</strong> {detail.profanityCount}
          </p>
          <p>
            <strong>공격 발언 수위:</strong> {detail.profanityLevel}
          </p>
          <p>
            <strong>주요 내용:</strong> {detail.keyPoint}
          </p>
          <p>
            <strong>학부모:</strong> {detail.parentConcern}
          </p>
          <p>
            <strong>선생님:</strong> {detail.teacherRecommendation}
          </p>
          <button onClick={onClose}>닫기</button>
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
            <div className={styles.consultHeader}>
              <div className={styles.headerDate}>날짜</div>
              <div className={styles.headerTopic}>주제</div>
              <div className={styles.headerContent}>내용</div>
            </div>
            <div className={styles.consultList}>
              {consultHistory.length > 0 ? (
                consultHistory.map((consult, index) => (
                  <div
                    key={index}
                    className={styles.consultRow}
                    onClick={() => handleConsultClick(consult.consultId)}
                  >
                    <div className={styles.dateColumn}>
                      {formatDate(consult.startTime)}
                    </div>
                    <div className={styles.topicColumn}>{consult.topic}</div>
                    <div className={styles.descriptionColumn}>
                      {consult.description || "설명 없음"}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noConsultHistory}>
                  상담 내역이 아직 없습니다.
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>학생을 찾을 수 없습니다.</p>
      )}

      {error && <Modal message={error} onClose={handleCloseModal} />}
      {isSummaryModalOpen && (
        <SummaryModal detail={consultDetail} onClose={handleCloseModal} />
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
