import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useConsultation } from "../../../store/ConsultationStore";
import styles from "./TeacherConsultationList.module.scss";
import ConsultationApproveModal from "./ConsultationApproveModal";
import ConsultationCancelModal from "./ConsultationCancelModal";

// topic db랑 화면 매핑
const topicDisplayMap = {
  FRIEND: "교우 관계",
  BULLYING: "학교 폭력",
  SCORE: "성적",
  CAREER: "진로",
  ATTITUDE: "학습 태도",
  OTHER: "기타",
};

const getTopicDisplay = (topic) => {
  return topicDisplayMap[topic] || topic;
};

// ConsultationItem 컴포넌트
const ConsultationItem = ({
  appointmentId,
  startTime,
  endTime,
  studentName,
  topic,
  description = "", // 기본값을 빈 문자열로 설정
  status,
  onApprove,
  onCancel,
}) => {
  const handleConsult = () => {
    // 비디오 링크
    window.open("https://www.naver.com", "_blank");
  };

  // 상담일자 커스터마이징
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <div className={styles.consultationRow}>
      <div className={styles.cell}>{formatDate(startTime)}</div>
      <div className={styles.cellSmall}>{`${formatTime(
        startTime
      )} ~ ${formatTime(endTime)}`}</div>
      <div className={styles.cellSmall}>{studentName}</div>
      <div className={styles.cellMedium}>{getTopicDisplay(topic)}</div>
      <div className={styles.cellLarge}>{description || "설명 없음"}</div>
      <div className={styles.cellButtons}>
        {status === "APPLY" ? (
          <>
            <button
              className={styles.approveButton}
              onClick={() => onApprove(appointmentId)}
            >
              승인
            </button>
            <button
              className={styles.rejectButton}
              onClick={() => onCancel(appointmentId)}
            >
              거절
            </button>
          </>
        ) : status === "ACCEPTED" ? (
          <button className={styles.statusButton} onClick={handleConsult}>
            상담 하기
          </button>
        ) : status === "CANCEL" ? (
          <span className={styles.cancelStatus}>취소됨</span>
        ) : (
          "예약불가"
        )}
      </div>
    </div>
  );
};

// propTypes
ConsultationItem.propTypes = {
  appointmentId: PropTypes.number.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  description: PropTypes.string,
  status: PropTypes.string.isRequired,
  onApprove: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// TeacherConsultationList 컴포넌트
const TeacherConsultationList = () => {
  const {
    consultations,
    loading,
    error,
    approveConsultation,
    cancelConsultation,
    sortConsultations,
  } = useConsultation();
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 정렬 순서 상태 추가

  const handleApprove = (appointmentId) => {
    setSelectedConsultationId(appointmentId);
    setApproveModalOpen(true);
  };

  const handleCancel = (appointmentId) => {
    setSelectedConsultationId(appointmentId);
    setCancelModalOpen(true);
  };

  const closeApproveModal = () => {
    setApproveModalOpen(false);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
  };

  const confirmApprove = async () => {
    await approveConsultation(selectedConsultationId);
    setApproveModalOpen(false);
  };

  const confirmCancel = async () => {
    await cancelConsultation(selectedConsultationId);
    setCancelModalOpen(false);
  };

  // 날짜 정렬 함수 추가
  const handleDateSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    sortConsultations("startTime", newOrder);
  };

  if (loading) return <div></div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className={styles.consultationlistContainer}>
      <nav className={styles.classNavbar}>
        <NavLink
          to="/teacherreservationmanagement"
          ConsultationItem
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
          <h3
            className={styles.cellHeader}
            onClick={handleDateSort}
            style={{ cursor: "pointer" }}
          >
            날짜 {sortOrder === "asc" ? "▲" : "▼"}
          </h3>
          <h3 className={styles.cellHeaderSmall}>시간</h3>
          <h3 className={styles.cellHeaderSmall}>이름</h3>
          <h3 className={styles.cellHeaderMedium}>주제</h3>
          <h3 className={styles.cellHeaderLarge}>내용</h3>
          <h3 className={styles.cellHeaderButtons}>관리</h3>
        </header>
        {consultations.map((consultation) => (
          <ConsultationItem
            key={consultation.appointmentId}
            {...consultation}
            onApprove={handleApprove}
            onCancel={handleCancel}
          />
        ))}
      </section>
      {isApproveModalOpen && (
        <ConsultationApproveModal
          onClose={closeApproveModal}
          onApprove={confirmApprove}
        />
      )}
      {isCancelModalOpen && (
        <ConsultationCancelModal
          onClose={closeCancelModal}
          onCancel={confirmCancel}
        />
      )}
    </div>
  );
};

export default TeacherConsultationList;
