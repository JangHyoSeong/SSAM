import React from 'react';
import styles from './TeacherApproveModal.module.scss';

const TeacherApprovalModal = ({ onClose, onApprove }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>승인하시겠습니까?</h3>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.approveButton}`} onClick={onApprove}>승인</button>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherApprovalModal;
