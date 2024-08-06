import React from "react";
import styles from "./TeacherApproveModal.module.scss";

const TeacherApproveModal = ({ request, onClose, onApprove }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>학생 승인</h2>
        <p>
          {request.name} 학생을 <br />
          승인하시겠습니까?
        </p>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.approveButton}`}
            onClick={onApprove}
          >
            승인
          </button>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherApproveModal;
