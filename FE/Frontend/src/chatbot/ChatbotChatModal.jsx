import styles from "./ChatbotChatModal.module.scss";
import SSAM from "../assets/SSAM.png";
import book from "../assets/book.png";
import chat from "../assets/chatblue.png";

// eslint-disable-next-line react/prop-types
const ChatbotStudyModal = ({ isVisible, closeModal }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={SSAM} className={styles.logo} />
        <hr />
        <div className={styles.chatContent}>
          <p>이곳은 대화방입니다</p>
        </div>
        <div className={styles.chatMenu}>
          <div className={styles.imgBox} onClick={closeModal}>
            <img src={book} className={styles.img} />
            <p>학습</p>
          </div>
          <div className={styles.imgBox}>
            <img src={chat} className={styles.img} />
            <p className={styles.chatTxt}>대화</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotStudyModal;
