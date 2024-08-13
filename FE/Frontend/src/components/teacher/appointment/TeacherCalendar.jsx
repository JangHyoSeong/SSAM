import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import styles from "./TeacherCalendar.module.scss";
import { useState, useEffect, useRef } from "react";

const TeacherCalendar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    onDateSelect(info.dateStr); // 선택된 날짜를 부모 컴포넌트에 전달
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const allCells = calendarApi.el.querySelectorAll(".fc-daygrid-day");
      allCells.forEach((cell) => {
        cell.classList.remove(styles.selectedDate);
        if (cell.dataset.date === selectedDate) {
          cell.classList.add(styles.selectedDate);
        }
      });
    }
  }, [selectedDate]);

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        dateClick={handleDateClick}
        weekends={false}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        locale={koLocale} // 로케일을 한국어로 설정
        dayCellContent={(arg) => arg.dayNumberText.replace("일", "")} // 날짜 셀에서 '일' 제거
        fixedWeekCount={false} // 마지막 주 숨기기
        height="100%"
      />
    </div>
  );
};

TeacherCalendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired, // onDateSelect prop 타입 정의
};

export default TeacherCalendar;
