import React from "react";
import styles from "./TeacherRejectModal.module.scss";

const TeacherRejectModal = ({ request, onClose, onReject }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>승인 거절</h2>
        <p>
          {request.name} 학생의 승인을 <br /> 거절하시겠습니까?
        </p>
        <button className={styles.rejectButton} onClick={onReject}>
          거절
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default TeacherRejectModal;
