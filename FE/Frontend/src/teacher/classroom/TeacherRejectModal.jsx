import styles from './TeacherRejectModal.module.scss';

const TeacherRejectModal = ({ onClose, onReject }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <p>거절하시겠습니까?</p>
        <div className={styles.buttonContainer}>
          <button className={styles.rejectButton} onClick={onReject}>거절</button>
          <button className={styles.cancelButton} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherRejectModal;
