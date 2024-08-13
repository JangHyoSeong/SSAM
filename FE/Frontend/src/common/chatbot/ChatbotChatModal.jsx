import { useState } from "react";
import styles from "./ChatbotModal.module.scss";
import book from "../../assets/book.png";
import chat from "../../assets/chatblue.png";

const ChatbotChatModal = ({ closeModal }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputText.trim()) {
      setMessages((prevMessages) => [...prevMessages, inputText]);
      setInputText("");
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topArray}>
        {/* <img src={SSAM} className={styles.logo} alt="Logo" /> */}
        <h4>SSAM 문의하기</h4>
      </div>
      <hr />
      <div className={styles.chatArray}>
        <div className={styles.chatContent}>
          {messages.map((message, index) => (
            <div key={index} className={styles.message}>
              {message}
            </div>
          ))}
        </div>
        <input
          type="text"
          className={`${styles.textInput} ${styles.chatTextInput}`}
          placeholder="채팅을 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.chatMenu}>
        <div className={styles.imgBox} onClick={closeModal}>
          <img src={book} className={styles.img} alt="book" />
          <p>학습</p>
        </div>
        <div className={styles.imgBox}>
          <img src={chat} className={styles.img} alt="chat" />
          <p className={styles.chatTxt}>대화</p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotChatModal;
