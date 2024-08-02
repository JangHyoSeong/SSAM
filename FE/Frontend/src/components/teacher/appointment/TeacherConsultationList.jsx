import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styles from "./TeacherConsultationList.module.scss";
import ConsultationApproveModal from "./ConsultationApproveModal";
import ConsultationRejectModal from "./ConsultationRejectModal";

const ConsultationItem = ({
  date,
  time,
  studentName,
  subject,
  content,
  onApprove,
  onReject,
  onToggleStatus,
  status,
}) => {
  return (
    <div className={styles.consultationRow}>
      <div className={styles.cell}>{date}</div>
      <div className={styles.cellSmall}>{time}</div>
      <div className={styles.cellSmall}>{studentName}</div>
      <div className={styles.cellMedium}>{subject}</div>
      <div className={styles.cellLarge}>{content}</div>
      <div className={styles.cellButtons}>
        {status === "approved" ? (
          <button className={styles.statusButton} onClick={onToggleStatus}>
            상담 하기
          </button>
        ) : status === "completed" ? (
          <button className={styles.statusButtonCompleted} onClick={onToggleStatus}>
            상담 완료
          </button>
        ) : status === "cancelled" ? (
          <button className={styles.statusButtonCancelled} onClick={onToggleStatus}>
            상담 취소
          </button>
        ) : (
          <>
            <button className={styles.approveButton} onClick={onApprove}>승인</button>
            <button className={styles.editButton} onClick={onReject}>거절</button>
          </>
        )}
      </div>
    </div>
  );
};

ConsultationItem.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

const TeacherConsultationList = () => {
  const initialConsultations = [
    {
      date: "2024-07-15",
      time: "15:00 ~ 15:20",
      studentName: "박범준",
      subject: "학교 생활",
      content: "우리 아이가 잘 지내고 있는지 궁금해요",
    },
    {
      date: "2024-07-16",
      time: "16:00 ~ 16:20",
      studentName: "김철수",
      subject: "학교 생활",
      content: "우리 아이가 잘 지내고 있는지 궁금해요",
    },
  ];

  const [consultations, setConsultations] = useState(initialConsultations);
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedConsultationIndex, setSelectedConsultationIndex] = useState(null);
  const [consultationStatus, setConsultationStatus] = useState(
    initialConsultations.map(() => ({ status: "pending" }))
  );

  const handleApprove = (index) => {
    setSelectedConsultationIndex(index);
    setApproveModalOpen(true);
  };

  const handleReject = (index) => {
    setSelectedConsultationIndex(index);
    setRejectModalOpen(true);
  };

  const closeApproveModal = () => {
    setApproveModalOpen(false);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
  };

  const approveConsultation = () => {
    setConsultationStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[selectedConsultationIndex].status = "approved";
      return newStatus;
    });
    setApproveModalOpen(false);
  };

  const rejectConsultation = () => {
    setConsultations((prevConsultations) => {
      const newConsultations = prevConsultations.filter((_, index) => index !== selectedConsultationIndex);
      return newConsultations;
    });
    setConsultationStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus.splice(selectedConsultationIndex, 1);
      return newStatus;
    });
    setRejectModalOpen(false);
  };

  const toggleStatus = (index) => {
    setConsultationStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index].status = newStatus[index].status === "approved" ? "completed" : "approved";
      return newStatus;
    });
  };

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
        {consultations.map((consultation, index) => (
          <ConsultationItem
            key={index}
            date={consultation.date}
            time={consultation.time}
            studentName={consultation.studentName}
            subject={consultation.subject}
            content={consultation.content}
            onApprove={() => handleApprove(index)}
            onReject={() => handleReject(index)}
            onToggleStatus={() => toggleStatus(index)}
            status={consultationStatus[index].status}
          />
        ))}
      </section>
      {isApproveModalOpen && (
        <ConsultationApproveModal
          onClose={closeApproveModal}
          onApprove={approveConsultation}
        />
      )}
      {isRejectModalOpen && (
        <ConsultationRejectModal
          onClose={closeRejectModal}
          onReject={rejectConsultation}
        />
      )}
    </div>
  );
};

export default TeacherConsultationList;
