import styles from './TeacherDeleteModal.module.css';
import { BsExclamationTriangle } from 'react-icons/bs';

const TeacherDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.teacherDeleteModalOverlay} onClick={onCancel}>
      <div className={styles.teacherDeleteModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.teacherDeleteModalHeader}>
          <BsExclamationTriangle className={styles.teacherDeleteModalIcon} />
        </div>
        <h2>질문을 삭제하시겠습니까?</h2>
        <div className={styles.teacherDeleteModalButtons}>
          <button onClick={onConfirm}>확인</button>
          <button onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDeleteModal;
