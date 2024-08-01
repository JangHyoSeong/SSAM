import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import styles from "./ParentsCalendar.module.scss";
import useTeacherCalendarStore from "../../../store/TeacherCalendarStore";

const ParentsCalendar = ({ onDateSelect }) => {
  const getAvailableCount = useTeacherCalendarStore(
    (state) => state.getAvailableCount
  );

  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // 날짜 선택 해제

    const availableCount = getAvailableCount(); // 상담 신청 가능 횟수 가져오기

    // 상담 신청 가능 횟수를 이벤트로 추가
    calendarApi.addEvent({
      title: `신청 가능: ${availableCount}회`,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });

    onDateSelect(selectInfo.startStr); // 선택된 날짜를 부모 컴포넌트에 전달
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        weekends={false}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        locale={koLocale} // 로케일을 한국어로 설정
        dayCellContent={(arg) => arg.dayNumberText.replace("일", "")} // 날짜 셀에서 '일' 제거
      />
    </div>
  );
};

ParentsCalendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired, // onDateSelect prop 타입 정의
};

export default ParentsCalendar;
