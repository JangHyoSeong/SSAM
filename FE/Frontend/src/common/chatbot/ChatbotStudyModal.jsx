import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ChatbotModal.module.scss";
import book from "../../assets/bookblue.png";
import chat from "../../assets/chat.png";
import upload from "../../assets/upload.png";
import { NoticeChatbot } from "../../apis/stub/78-80 챗봇/apiTeacherChatBot"; // 경로에 맞게 수정하세요
import { FamilyChatbot } from "../../apis/stub/78-80 챗봇/apiTeacherFamilyChatBot";

const ChatbotStudyModal = ({ openModal }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 한국 시간으로 변환하고, 포맷을 yyyy-MM-ddTHH:mm:ss로 변환하는 함수
  const formatDateToKST = (date) => {
    const kstOffset = 9 * 60; // 한국 표준시는 UTC+9
    const kstDate = new Date(date.getTime() + kstOffset * 60 * 1000);

    const yyyy = kstDate.getFullYear();
    const MM = String(kstDate.getMonth() + 1).padStart(2, "0");
    const dd = String(kstDate.getDate()).padStart(2, "0");
    const HH = String(kstDate.getHours()).padStart(2, "0");
    const mm = String(kstDate.getMinutes()).padStart(2, "0");
    const ss = String(kstDate.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && inputText.trim() && startDate && endDate) {
      try {
        let response;

        if (selectedFile) {
          // 파일이 선택된 경우
          response = await FamilyChatbot(
            inputText,
            formatDateToKST(startDate),
            formatDateToKST(endDate),
            selectedFile
          );
        } else {
          // 파일이 선택되지 않은 경우
          response = await NoticeChatbot(
            inputText,
            formatDateToKST(startDate),
            formatDateToKST(endDate)
          );
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          `공지사항 등록: ${response.message}`,
        ]);
      } catch (error) {
        setMessages((prevMessages) => [...prevMessages, "공지사항 등록 실패"]);
      }

      setInputText(""); // 입력 필드를 초기화
      setSelectedFile(null); // 파일 선택 필드를 초기화
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.topArray}>
        <h4>SSAM 학습하기</h4>
      </div>
      <hr />
      <div className={styles.chatArray}>
        <div className={styles.chatContent}>
          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} className={styles.message}>
                {message}
              </div>
            ))}
          </div>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy/MM/dd" // 날짜 형식 지정
              placeholderText="시작 날짜"
              className={styles.startDatePicker} // 시작 날짜 선택기
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy/MM/dd" // 날짜 형식 지정
              placeholderText="끝나는 날짜"
              className={styles.endDatePicker} // 끝나는 날짜 선택기
            />
          </div>
        </div>
        <input
          id="file"
          type="file"
          className={styles.inputFile}
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          <img src={upload} className={styles.uploadImg} alt="Upload" />
        </label>
        <input
          type="text"
          className={`${styles.textInput} ${styles.studyTextInput}`}
          placeholder="공지 내용을 입력하세요"
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
