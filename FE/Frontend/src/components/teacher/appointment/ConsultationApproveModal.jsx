import React from 'react';
import PropTypes from 'prop-types';
import styles from './ConsultationApproveModal.module.scss';

const ConsultationApproveModal = ({ onClose, onApprove }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h3>상담을 승인하시겠습니까?</h3>
      <div className={styles.buttonContainer}>
        <button className={styles.approveButton} onClick={onApprove}>승인</button>
        <button className={styles.closeButton} onClick={onClose}>닫기</button>
      </div>
    </div>
  </div>
);

ConsultationApproveModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
};

export default ConsultationApproveModal;
