import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useConsultation } from "../../../store/ConsultationStore";
import styles from "./TeacherConsultationList.module.scss";
import ConsultationApproveModal from "./ConsultationApproveModal";
import ConsultationCancelModal from "./ConsultationCancelModal";
import LoadingSpinner from "../../../common/ModernLoading";
import Swal from "sweetalert2";

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
  accessCode,
  onApprove,
  onCancel,
}) => {
  const apiUrl = import.meta.env.API_URL;
  // 비디오 링크
  const handleConsult = () => {
    if (accessCode) {
      window.open(`${apiUrl}/video/${accessCode}`, "_blank");
    } else {
      console.error("Access code not found for this consultation");
      // 사용자에게 오류 메시지 표시
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "상담 링크를 열 수 없습니다. 관리자에게 문의해주세요.",
      });
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 시간 포맷 함수
  const formatTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    return `${start.toLocaleTimeString(
      "ko-KR",
      timeOptions
    )} ~ ${end.toLocaleTimeString("ko-KR", timeOptions)}`;
  };

  return (
    <div className={styles.consultationRow}>
      <div className={styles.cellDate}>{formatDate(startTime)}</div>
      <div className={styles.cellTime}>{formatTime(startTime, endTime)}</div>
      <div className={styles.cellSmall}>{studentName}</div>
      <div className={styles.cellMedium}>{getTopicDisplay(topic)}</div>
      <div className={styles.cellDescription}>{description || "설명 없음"}</div>
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
          <span className={styles.cancelStatus}>상담 취소</span>
        ) : status === "DONE" ? (
          <span className={styles.doneStatus} style={{ color: "orange" }}>
            상담 완료
          </span>
        ) : (
          <span className={styles.rejectStatus}>예약 불가</span>
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
  accessCode: PropTypes.string,
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
  const [activeFilters, setActiveFilters] = useState([]);

  const handleApprove = (appointmentId) => {
    Swal.fire({
      title: "상담을 승인하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "승인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        approveConsultation(appointmentId)
          .then(() => {
            Swal.fire({
              title: "승인 완료!",
              text: "상담이 승인되었습니다.",
              icon: "success",
              timer: 1500,
            }).then(() => {
              // 승인 완료 메시지가 표시된 후 페이지 새로고침
              window.location.reload();
            });
          })
          .catch((error) => {
            // 에러 처리
            Swal.fire({
              title: "오류 발생",
              text: "승인 처리 중 문제가 발생했습니다.",
              icon: "error",
            });
            console.error("승인 처리 중 오류:", error);
          });
      }
    });
  };

  const handleCancel = (appointmentId) => {
    Swal.fire({
      title: "상담을 거절하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "거절",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelConsultation(appointmentId);
        Swal.fire({
          title: "거절 완료!",
          text: "상담이 거절되었습니다.",
          icon: "success",
          timer: 1500,
        });
      }
    });
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

  // 필터 토글 함수 추가
  const statusLabels = {
    APPLY: "신청",
    CANCEL: "취소",
    ACCEPTED: "승인",
    REJECT: "불가",
    DONE: "완료",
  };

  const handleFilterToggle = (status) => {
    setActiveFilters((prevFilters) =>
      prevFilters.includes(status)
        ? prevFilters.filter((f) => f !== status)
        : [...prevFilters, status]
    );
  };

  const filteredConsultations = useMemo(() => {
    return activeFilters.length === 0
      ? consultations
      : consultations.filter((consultation) =>
          activeFilters.includes(consultation.status)
        );
  }, [consultations, activeFilters]);

  if (loading) return <LoadingSpinner />;
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
        <div className={styles.filterContainer}>
          {Object.entries(statusLabels).map(([status, label]) => (
            <button
              key={status}
              className={`${styles.filterButton} ${
                activeFilters.includes(status) ? styles.activeFilter : ""
              }`}
              onClick={() => handleFilterToggle(status)}
            >
              {label}
            </button>
          ))}
        </div>
        <header className={styles.headerRow}>
          <h3
            className={styles.cellHeaderDate}
            onClick={handleDateSort}
            style={{ cursor: "pointer" }}
          >
            날짜 {sortOrder === "asc" ? "▲" : "▼"}
          </h3>
          <h3 className={styles.cellHeaderTime}>시간</h3>
          <h3 className={styles.cellHeaderSmall}>이름</h3>
          <h3
            className={styles.cellHeaderMedium}
            style={{ paddingRight: "20px" }}
          >
            주제
          </h3>
          <h3 className={styles.cellHeaderDescription}>내용</h3>
          <h3 className={styles.cellHeaderButtons}>관리</h3>
        </header>
        {filteredConsultations.map((consultation) => (
          <ConsultationItem
            key={consultation.appointmentId}
            {...consultation}
            accessCode={consultation.accessCode}
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
