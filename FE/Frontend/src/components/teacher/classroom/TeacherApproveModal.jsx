import React from "react";
import styles from "./TeacherApproveModal.module.scss";

const TeacherApproveModal = ({ request, onClose, onApprove }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>승인 수락</h2>
        <p>
          {request.name} 학생의 승인을 <br />
          수락하시겠습니까?
        </p>
        <button className={styles.approveButton} onClick={onApprove}>
          승인
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default TeacherApproveModal;
