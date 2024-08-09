import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useConsultation } from "../../../store/ConsultationStore";
import styles from "./TeacherConsultationList.module.scss";
import ConsultationApproveModal from "./ConsultationApproveModal";
import ConsultationRejectModal from "./ConsultationRejectModal";

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
  onReject,
}) => {
  const handleConsult = () => {
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
              className={styles.editButton}
              onClick={() => onReject(appointmentId)}
            >
              거절
            </button>
          </>
        ) : status === "APPROVED" ? (
          <button className={styles.statusButton} onClick={handleConsult}>
            상담 하기
          </button>
        ) : (
          <span className={styles.rejectedStatus}>거절됨</span>
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
  onReject: PropTypes.func.isRequired,
};

// TeacherConsultationList 컴포넌트
const TeacherConsultationList = () => {
  const {
    consultations,
    loading,
    error,
    approveConsultation,
    rejectConsultation,
  } = useConsultation();
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);

  const handleApprove = (appointmentId) => {
    setSelectedConsultationId(appointmentId);
    setApproveModalOpen(true);
  };

  const handleReject = (appointmentId) => {
    setSelectedConsultationId(appointmentId);
    setRejectModalOpen(true);
  };

  const closeApproveModal = () => {
    setApproveModalOpen(false);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
  };

  const confirmApprove = async () => {
    await approveConsultation(selectedConsultationId);
    setApproveModalOpen(false);
  };

  const confirmReject = async () => {
    await rejectConsultation(selectedConsultationId);
    setRejectModalOpen(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className={styles.consultationlistContainer}>
      <nav className={styles.classNavbar}>
        <NavLink
          to="/teacherreservationmanagement"
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
          <h3 className={styles.cellHeader}>날짜</h3>
          <h3 className={styles.cellHeaderSmall}>시간</h3>
          <h3 className={styles.cellHeaderSmall}>이름</h3>
          <h3 className={styles.cellHeaderMedium}>주제</h3>
          <h3 className={styles.cellHeaderLarge}>내용</h3>
          <h3 className={styles.cellHeaderButtons}>관리</h3>
        </header>
        {consultations.map((consultation) => (
          <ConsultationItem
            key={consultation.appointmentId}
            appointmentId={consultation.appointmentId}
            startTime={consultation.startTime}
            endTime={consultation.endTime}
            studentName={consultation.studentName}
            topic={consultation.topic}
            description={consultation.description}
            status={consultation.status}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </section>
      {isApproveModalOpen && (
        <ConsultationApproveModal
          onClose={closeApproveModal}
          onApprove={confirmApprove}
        />
      )}
      {isRejectModalOpen && (
        <ConsultationRejectModal
          onClose={closeRejectModal}
          onReject={confirmReject}
        />
      )}
    </div>
  );
};

export default TeacherConsultationList;
