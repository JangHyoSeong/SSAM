import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import styles from "./ParentsCalendar.module.scss";
import { useState, useEffect, useRef } from "react";
import useTeacherCalendarStore from "../../../store/TeacherCalendarStore";

const ParentsCalendar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const { setCurrentDate, fetchReservations } = useTeacherCalendarStore(); // store에서 필요한 함수들을 가져옵니다.

  const handleDateClick = async (info) => {
    setSelectedDate(info.dateStr);
    onDateSelect(info.dateStr); // 선택된 날짜를 부모 컴포넌트에 전달

    // store의 currentDate를 업데이트하고 예약 정보를 가져옵니다.
    setCurrentDate(info.dateStr);
    await fetchReservations();
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
        locale={koLocale}
        dayCellContent={(arg) => arg.dayNumberText.replace("일", "")}
        fixedWeekCount={false}
        height="auto"
      />
    </div>
  );
};

ParentsCalendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
};

export default ParentsCalendar;
