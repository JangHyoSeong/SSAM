import { useState } from "react";
import styles from "./EnterCode.module.scss";
import ClassEnterModal from './ClassEnterModal';

const EnterCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.EnterArray}>
      <div className={styles.EnterTxtBox}>
        <h2>박범준님 환영합니다</h2>
        <h3>선생님께 받은 초대코드로 학급을 등록하세요.</h3>
      </div>
      <button className={styles.classBtn} onClick={toggleModal}>
        초대코드 입력하기
      </button>
      {isModalOpen && <ClassEnterModal />}
    </div>
  );
};
export default EnterCode;
