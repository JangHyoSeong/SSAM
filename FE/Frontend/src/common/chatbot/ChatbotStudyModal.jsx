import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ChatbotModal.module.scss";
import book from "../../assets/bookblue.png";
import chat from "../../assets/chat.png";
import upload from "../../assets/upload.png";
import { NoticeChatbot } from "../../apis/stub/78-80 챗봇/apiTeacherChatBot";
import { FamilyChatbot } from "../../apis/stub/78-80 챗봇/apiTeacherFamilyChatBot";

const ChatbotStudyModal = ({ openModal }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 선택한 날짜의 시간을 00:00:00로 설정하고 9시간 더하는 함수
  const handleStartDateChange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0); // 선택한 날짜의 자정으로 설정
    start.setTime(start.getTime() + 9 * 60 * 60 * 1000); // 9시간 더하기
    setStartDate(start);
  };

  // 선택한 날짜의 시간을 23:59:59로 설정하고 9시간 더하는 함수
  const handleEndDateChange = (date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // 선택한 날짜의 23:59:59로 설정
    end.setTime(end.getTime() + 9 * 60 * 60 * 1000); // 9시간 더하기
    setEndDate(end);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && inputText.trim() && startDate && endDate) {
      try {
        let response;

        if (selectedFile) {
          response = await FamilyChatbot(
            inputText,
            startDate.toISOString(), // UTC 시간으로 변환
            endDate.toISOString(), // UTC 시간으로 변환
            selectedFile
          );
        } else {
          response = await NoticeChatbot(
            inputText,
            startDate.toISOString(), // UTC 시간으로 변환
            endDate.toISOString() // UTC 시간으로 변환
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
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInputText((prevText) => `${prevText} [파일: ${file.name}]`); // inputText에 파일 이름 추가
    }
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
              onChange={handleStartDateChange}
              dateFormat="yyyy/MM/dd"
              placeholderText="시작 날짜"
              className={styles.startDatePicker}
            />
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy/MM/dd"
              placeholderText="끝나는 날짜"
              className={styles.endDatePicker}
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
