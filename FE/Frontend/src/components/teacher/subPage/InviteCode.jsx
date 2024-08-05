import axios from "axios";
import { useState } from "react";
import styles from "./InviteCode.module.scss";
import ClassProduceModal from "./ClassProduceModal";

const InviteCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // board_id 값을 임의로 변경해야 작동하는 중...
  // board_id 값을 자동으로 설정되게 해야함
  const handleDelete = async (board_id) => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      await axios.delete(`http://localhost:8081/v1/classrooms/teachers/${board_id}`, {
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

  return (
    <div className={styles.inviteCodeBox}>
      <div className={styles.inviteTxtBox}>
        <h2>선생님 환영합니다</h2>
        <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
      </div>
      <button className={styles.classBtn} onClick={toggleModal}>
        학급 만들기
      </button>
      <button className={styles.deleteBtn} onClick={handleDelete}>
        학급 삭제
      </button>
      {isModalOpen && <ClassProduceModal />}
    </div>
  );
};

export default InviteCode;
