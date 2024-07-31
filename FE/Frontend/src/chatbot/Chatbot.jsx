import { useState } from "react";
import styles from "./Chatbot.module.scss";
import SSAM from "../assets/SSAM.png";
import chatbotImg from "../assets/chatbot.png";
import book from "../assets/book.png";
import chat from "../assets/chat.png";

const Chatbot = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  const toggleBoxVisibility = () => {
    setIsBoxVisible(!isBoxVisible);
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
          <div className={styles.chatContent}></div>
          <div className={styles.chatMenu}>
            <div className={styles.imgBox}>
              <img src={book} className={styles.img} />
              <p>학습</p>
            </div>
            <div className={styles.imgBox}>
              <img src={chat} className={styles.img} />
              <p>대화</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
