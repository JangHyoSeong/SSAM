import axios from "axios";
import { useState } from "react";
import styles from "./InviteCode.module.scss";
import ClassProduceModal from "./ClassProduceModal";

const InviteCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const classDelete = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const boardId = 1;
      await axios.delete(`http://localhost:8081/v1/classrooms/teachers/${boardId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      alert("학급이 삭제되었습니다");
    } catch (error) {
      console.error("Error deleting classroom", error);
      alert("실패");
    }
  };

  const rePin = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const boardId = 1;
      await axios.put(
        `http://localhost:8081/v1/classrooms/teachers/pin/${boardId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      alert("PIN이 재발급되었습니다");
    } catch (error) {
      console.error("Error regenerating PIN", error);
      alert("PIN 재발급 실패");
    }
  };

  return (
    <div className={styles.inviteCodeBox}>
      <div className={styles.inviteTxtBox}>
        <h2>선생님 환영합니다</h2>
        <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
      </div>
      <button className={styles.classBtn} onClick={toggleModal}>
        학급 만들기
      </button>
      <button className={styles.deleteBtn} onClick={classDelete}>
        학급 삭제
      </button>
      <button className={styles.pinArray} onClick={rePin}>
        PIN 재발급
      </button>
      {isModalOpen && <ClassProduceModal />}
    </div>
  );
};

export default InviteCode;
