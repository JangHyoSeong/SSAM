import { useState } from "react";
import axios from "axios";
import styles from "./ClassProduceModal.module.scss";

const ClassProduceModal = () => {
  const [showModal, setShowModal] = useState(true);
  const [grade, setGrade] = useState("");
  const [classroom, setClassroom] = useState("");
  const handleClose = () => {
    setShowModal(false);
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const response = await axios.post(
        "/classrooms/teachers",
        {
          grade,
          classroom,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );
      console.log(response.data);
      alert("성공");
      setShowModal(false);
    } catch (error) {
      console.error("Error posting data", error);
      alert("실패");
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.produceArray}>
      <div className={styles.modalArray}>
        <div className={styles.classInput}>
          <p>학년</p>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <p>반</p>
          <input
            type="text"
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            onClick={handleCreate}
            className={`${styles.button} ${styles.approveButton}`}
          >
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
    </div>
  );
};

export default ClassProduceModal;
