import { useState } from "react";
import styles from "./StudentChatModal.module.scss";

const StudentChatModal = ({ closeModal }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputText.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, sentByUser: true },
      ]);
      setInputText("");
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topArray}>
        <h4>SSAM 문의하기</h4>
      </div>
      <hr />
      <div className={styles.chatArray}>
        <div className={styles.chatContent}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.sentByUser ? styles.sent : styles.received
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          className={`${styles.textInput}`}
          placeholder="채팅을 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default StudentChatModal;
