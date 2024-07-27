import { useState, useEffect } from "react";
import styles from "./TeacherReservationList.module.scss";
import { FiCalendar } from "react-icons/fi"; // Ensure you have react-icons installed

const ConsultationList = ({ selectedDate }) => {
  const [consultations, setConsultations] = useState([]);

  // selectedDate가 변경될 때마다 상태를 초기화
  useEffect(() => {
    const initializeConsultations = [
      { time: "14:00 ~ 14:20", available: true },
      { time: "14:30 ~ 14:50", available: true },
      { time: "15:00 ~ 15:20", available: true },
      { time: "15:30 ~ 15:50", available: true },
      { time: "16:00 ~ 16:20", available: false },
      { time: "16:30 ~ 16:50", available: true },
      { time: "17:00 ~ 17:20", available: false },
    ];
    setConsultations(initializeConsultations);
  }, [selectedDate]);

  // 버튼 클릭 핸들러 추가
  const toggleAvailability = (index) => {
    setConsultations((prevConsultations) =>
      prevConsultations.map((consultation, i) =>
        i === index
          ? { ...consultation, available: !consultation.available }
          : consultation
      )
    );
  };

  return (
    <div className={styles.consultationList}>
      <div className={styles.header}>
        <h2>{selectedDate}</h2>
        <FiCalendar className={styles.calendarIcon} />
      </div>
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
                  consultation.available ? styles.available : styles.unavailable
                }
                // disabled={!consultation.available}
                // 버튼 클릭 시 신청 가능/불가능 상태 변경
                onClick={() => toggleAvailability(index)}
              >
                {consultation.available ? "신청가능" : "신청불가"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button className={styles.modify}>수정</button>
        <button className={styles.cancel}>취소</button>
      </div>
    </div>
  );
};

export default ConsultationList;
