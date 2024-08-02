<<<<<<< HEAD
import styles from "./ClassProduceModal.module.scss";

const ClassProduceModal = () => {
  return (
    <div className={styles.produceArray}>
      <div className={styles.modalArray}></div>
=======
import { useState } from "react";
import styles from "./ClassProduceModal.module.scss";

const ClassProduceModal = () => {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.produceArray}>
      <div className={styles.modalArray}>
        <div className={styles.classInput}>
          <p>학년</p>
          <input type="text" />
          <p>반</p>
          <input type="text" />
        </div>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.approveButton}`}>
            생성
          </button>
          <button
            onClick={handleClose}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            취소
          </button>
        </div>
      </div>
>>>>>>> master
    </div>
  );
};

export default ClassProduceModal;
