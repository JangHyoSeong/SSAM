import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./TeacherCalendar.module.scss";

const TeacherCalendar = () => {
  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // 날짜 선택 해제

    // alert창 없애고 모달로 바꿔야함
    if (confirm(`${selectInfo.startStr}에 상담을 예약하시겠습니까?`)) {
      calendarApi.addEvent({
        title: "상담예정",
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  return (
    <div
      // className={`${styles.calendarContainer} ${styles.calendarContainer.fc}`}
      className={styles.calendarContainer}
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
      />
    </div>
  );
};

export default TeacherCalendar;
