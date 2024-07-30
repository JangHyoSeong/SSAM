import PropTypes from "prop-types";
import { useState } from "react";
import { FiCalendar } from "react-icons/fi"; // react-icons를 설치했는지 확인하세요.
import useTeacherCalendarStore from "../../store/TeacherCalendarStore";
import styles from "./ParentsReservationList.module.scss";

const ParentsReservationList = ({ selectedDate }) => {
  const initialConsultations = useTeacherCalendarStore(
    (state) => state.consultations
  );
  const [consultations, setConsultations] = useState(initialConsultations);
  const [showModal, setShowModal] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);

  // selectedDate를 문자열로 변환하여 표시
  const formatDate = (date) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  // 버튼 클릭 시 색상 변경 및 상태 업데이트
  const handleClick = (index) => {
    const updatedConsultations = consultations.map((consultation, i) => {
      if (i === index) {
        return {
          ...consultation,
          text: consultation.text === "신청 취소" ? "" : consultation.text,
          available:
            consultation.text === "신청 취소" ? true : consultation.available,
        };
      }
      return consultation;
    });
    setConsultations(updatedConsultations);
    setClickedIndex(index);
  };

  // 예약하기 버튼 클릭 시 실행되는 함수
  const handleReservation = () => {
    if (clickedIndex !== null) {
      const updatedConsultations = consultations.map((consultation, i) => {
        if (i === clickedIndex) {
          return {
            ...consultation,
            text: "신청 취소",
            available: false,
          };
        }
        return consultation;
      });
      setConsultations(updatedConsultations);
      setClickedIndex(null);
      setShowModal(true); // 모달 표시
    }
  };

  // 취소 버튼 클릭 시 실행되는 함수
  const handleCancel = () => {
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <div className={styles.consultationList}>
      <div className={styles.header}>
        <h2>{formatDate(selectedDate)}</h2>
        <FiCalendar className={styles.calendarIcon} />

        {/* 상담 목적 선택 필터 */}
        <div className={styles.filterContainer}>
          <select
            id="consultationPurpose"
            className={styles.filterSelect}
            defaultValue=""
          >
            <option value="" disabled>
              상담 목적을 선택해주세요!
            </option>
            <option value="정기 상담">정기 상담</option>
            <option value="학교 생활">학교 생활</option>
            <option value="교육 관계">교육 관계</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </div>

      {/* 상담 시간 테이블 */}
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.cellHeader}>상담 시간</div>
          <div className={styles.cellHeader}>상담 신청</div>
        </div>
        {consultations.map((consultation, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.cell}>{consultation.time}</div>
            <div className={styles.cell}>
              <button
                className={
                  consultation.available
                    ? index === clickedIndex
                      ? styles.clicked
                      : styles.available
                    : consultation.text === "신청 취소"
                    ? `${styles.unavailable} ${styles.reservationCancel}`
                    : styles.unavailable
                }
                onClick={() => handleClick(index)}
                style={
                  consultation.text === "신청 취소"
                    ? { backgroundColor: "#FF0000", color: "#FFFFFF" }
                    : {}
                }
              >
                {consultation.text ? consultation.text : "신청 가능"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 상담 신청 내용을 입력할 수 있는 공간 */}
      <textarea
        className={styles.consultationInput}
        placeholder="상담 내용을 입력해 주세요. (50자 이내)"
      />
      <div className={styles.actions}>
        <button className={styles.modify} onClick={handleReservation}>
          예약하기
        </button>
        <button className={styles.cancel} onClick={handleCancel}>
          취소
        </button>
      </div>

      {/* 예약 완료 모달 창 */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>예약되었습니다.</h3>
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.button} ${styles.approveButton}`}
                onClick={() => setShowModal(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes 설정
ParentsReservationList.propTypes = {
  selectedDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
};

export default ParentsReservationList;
