import { useState, useEffect } from "react";
import styles from "./TeacherConsultationList.module.scss";

const ConsultationList = ({ selectedDate }) => {
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    // Update consultations based on selectedDate
    // This is a placeholder, replace with actual data fetching or logic
    const updatedConsultations = [
      { time: "14:00 ~ 14:20", available: true },
      { time: "14:30 ~ 14:50", available: true },
      { time: "15:00 ~ 15:20", available: true },
      { time: "15:30 ~ 15:50", available: true },
      { time: "16:00 ~ 16:20", available: false },
      { time: "16:30 ~ 16:50", available: true },
      { time: "17:00 ~ 17:20", available: false },
    ];
    setConsultations(updatedConsultations);
  }, [selectedDate]);

  return (
    <div className={styles.consultationList}>
      <div className={styles.header}>
        <h2>{selectedDate}</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>상담 시간</th>
            <th>상담 신청</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((consultation, index) => (
            <tr key={index}>
              <td>{consultation.time}</td>
              <td>
                <button
                  className={
                    consultation.available
                      ? styles.available
                      : styles.unavailable
                  }
                  disabled={!consultation.available}
                >
                  {consultation.available ? "신청가능" : "신청불가"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.actions}>
        <button className={styles.modify}>수정</button>
        <button className={styles.cancel}>취소</button>
      </div>
    </div>
  );
};

export default ConsultationList;
