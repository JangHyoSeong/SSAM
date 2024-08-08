import React from "react";
import styles from "./TeacherRejectModal.module.scss";

const TeacherRejectModal = ({ request, onClose, onReject }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>승인 거절</h2>
        <p>정말로 {request.name} 학생의 요청을 거절하시겠습니까?</p>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={onReject}
          >
            거절
          </button>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherRejectModal;
