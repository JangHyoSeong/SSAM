import PropTypes from "prop-types";
import { FiCalendar } from "react-icons/fi"; // Ensure you have react-icons installed
import useTeacherCalendarStore from "../../store/TeacherCalendarStore";
import styles from "./ParentsReservationList.module.scss";

const ParentsReservationList = ({ selectedDate }) => {
  const consultations = useTeacherCalendarStore((state) => state.consultations);
  const toggleAvailability = useTeacherCalendarStore(
    (state) => state.toggleAvailability
  );

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

  return (
    <div className={styles.consultationList}>
      <div className={styles.header}>
        <h2>{formatDate(selectedDate)}</h2>
        <FiCalendar className={styles.calendarIcon} />
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
                  consultation.available ? styles.available : styles.unavailable
                }
                // 버튼 클릭 시 신청 가능/불가능 상태 변경
                onClick={() => toggleAvailability(index)}
              >
                {consultation.available ? "신청가능" : "신청불가"}
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
        <button className={styles.modify}>예약하기</button>
        <button className={styles.cancel}>취소</button>
      </div>
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
