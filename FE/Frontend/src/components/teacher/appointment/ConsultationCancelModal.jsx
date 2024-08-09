import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./ConsultationCancelModal.module.scss";

const ConsultationRejectModal = ({ onClose, onReject }) => {
  const [isRejected, setIsRejected] = useState(false);

  const handleReject = () => {
    setIsRejected(true);
    onReject();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p>상담을 거절하시겠습니까?</p>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={handleReject}>
            거절
          </button>
          {!isRejected && (
            <button className={styles.closeButton} onClick={onClose}>
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ConsultationRejectModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default ConsultationRejectModal;
