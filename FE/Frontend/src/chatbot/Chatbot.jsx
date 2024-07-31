import { useState } from "react";
import styles from "./Chatbot.module.scss";
import SSAM from "../assets/SSAM.png";
import chatbotImg from "../assets/chatbot.png";
import book from "../assets/bookblue.png";
import chat from "../assets/chat.png";
import ChatbotChatModal from "./ChatbotChatModal";

const Chatbot = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
    if (isBoxVisible && isModalVisible) {
      setIsModalVisible(false);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.FieldArray}>
      <img
        src={chatbotImg}
        className={styles.ChatbotImg}
        onClick={toggleBoxVisibility}
      />
      {isBoxVisible && (
        <div className={styles.formBox}>
          <img src={SSAM} className={styles.logo} />
          <hr />
          <div className={styles.chatContent}>
            <p>이곳은 학습방입니다</p>
          </div>
          <div className={styles.chatMenu}>
            <div className={styles.imgBox}>
              <img src={book} className={styles.img} />
              <p className={styles.studyTxt}>학습</p>
            </div>
            <div className={styles.imgBox} onClick={openModal}>
              <img src={chat} className={styles.img} />
              <p>대화</p>
            </div>
          </div>
        </div>
      )}
      {isModalVisible && (
        <ChatbotChatModal isVisible={isModalVisible} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Chatbot;
