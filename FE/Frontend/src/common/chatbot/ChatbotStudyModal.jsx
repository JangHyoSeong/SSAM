import { useState } from "react";
import styles from "./ChatbotModal.module.scss";
import SSAM from "../../assets/SSAM.png";
import book from "../../assets/bookblue.png";
import chat from "../../assets/chat.png";
import upload from "../../assets/upload.png";

const ChatbotStudyModal = ({ openModal }) => {
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
        <img src={SSAM} className={styles.logo} alt="Logo" />
        <h4>SSAM 학습하기</h4>
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
        <input id="file" type="file" className={styles.inputFile} />
        <label htmlFor="file">
          <img src={upload} className={styles.uploadImg} alt="Upload" />
        </label>
        <input
          type="text"
          className={`${styles.textInput} ${styles.studyTextInput}`}
          placeholder="채팅을 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.chatMenu}>
        <div className={styles.imgBox}>
          <img src={book} className={styles.img} alt="book" />
          <p className={styles.chatTxt}>학습</p>
        </div>
        <div className={styles.imgBox} onClick={openModal}>
          <img src={chat} className={styles.img} alt="chat" />
          <p>대화</p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotStudyModal;
