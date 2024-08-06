import { useState } from "react";
import axios from "axios";
import styles from "./ClassProduceModal.module.scss";

const ClassProduceModal = () => {
  const [showModal, setShowModal] = useState(true);
  const [grade, setGrade] = useState("");
  const [classroom, setClassroom] = useState("");
  const classClose = () => {
    setShowModal(false);
  };

  // 학급 생성하기
  const classCreate = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const response = await axios.post(
        "http://localhost:8081/v1/classrooms/teachers",
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
      alert("학급이 생성되었습니다");
      setShowModal(false);
    } catch (error) {
      console.error("Error posting data", error);
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.produceArray}>
      <div className={styles.modalArray}>
        <p>우리 학급 생성하기</p>
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
            onClick={classCreate}
            className={`${styles.button} ${styles.approveButton}`}
          >
            생성
          </button>
          <button
            onClick={classClose}
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
