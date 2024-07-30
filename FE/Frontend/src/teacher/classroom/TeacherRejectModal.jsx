import React from 'react';
import styles from './TeacherRejectModal.module.scss';

const TeacherRejectModal = ({ onClose, onReject }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>거절하시겠습니까?</h3>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.rejectButton}`} onClick={onReject}>거절</button>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherRejectModal;
