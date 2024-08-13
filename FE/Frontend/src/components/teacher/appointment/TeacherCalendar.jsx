import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import styles from "./TeacherCalendar.module.scss";
import { useState, useEffect, useRef } from "react";
import { fetchApiReservationList } from "../../../apis/stub/55-59 상담/apiStubReservation"; // API 함수 import 경로를 적절히 수정해주세요

const TeacherCalendar = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await fetchApiReservationList();
        setConsultations(data);
      } catch (error) {
        console.error("상담 정보를 가져오는데 실패했습니다:", error);
      }
    };

    fetchConsultations();
  }, []);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    onDateSelect(info.dateStr);
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

  const getConsultationsCountByDate = (date) => {
    return consultations.filter((consultation) => {
      const consultDate = new Date(consultation.startTime);
      consultDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      return (
        consultDate.getTime() === targetDate.getTime() &&
        ["APPLY", "ACCEPTED", "DONE"].includes(consultation.status)
      );
    }).length;
  };

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
        timeZone="Asia/Seoul"
        dayCellContent={(arg) => {
          const count = getConsultationsCountByDate(arg.date);
          return (
            <div className={styles.dateCell}>
              <span className={styles.dayNumber}>{arg.dayNumberText}</span>
              {count > 0 && (
                <span className={styles.additionalNumber}>{count}</span>
              )}
            </div>
          );
        }}
        fixedWeekCount={false}
        height="100%"
      />
    </div>
  );
};

TeacherCalendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
};

export default TeacherCalendar;
// import PropTypes from "prop-types";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import koLocale from "@fullcalendar/core/locales/ko";
// import styles from "./TeacherCalendar.module.scss";
// import { useState, useEffect, useRef } from "react";

// const TeacherCalendar = ({ onDateSelect }) => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const calendarRef = useRef(null);

//   // 날짜 클릭 핸들러: 선택된 날짜를 상태로 저장하고 부모 컴포넌트에 전달
//   const handleDateClick = (info) => {
//     setSelectedDate(info.dateStr);
//     onDateSelect(info.dateStr);
//   };

//   // 선택된 날짜에 스타일 적용을 위한 useEffect
//   useEffect(() => {
//     if (calendarRef.current) {
//       const calendarApi = calendarRef.current.getApi();
//       const allCells = calendarApi.el.querySelectorAll(".fc-daygrid-day");
//       allCells.forEach((cell) => {
//         cell.classList.remove(styles.selectedDate);
//         if (cell.dataset.date === selectedDate) {
//           cell.classList.add(styles.selectedDate);
//         }
//       });
//     }
//   }, [selectedDate]);

//   return (
//     <div className={styles.calendarContainer}>
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         selectable={true}
//         dateClick={handleDateClick}
//         weekends={false}
//         headerToolbar={{
//           left: "prev",
//           center: "title",
//           right: "next",
//         }}
//         locale={koLocale}
//         // 각 날짜 셀의 내용을 커스터마이즈
//         dayCellContent={(arg) => {
//           const day = arg.date.getDate();
//           const dayText = day.toString().replace("일", "");
//           return (
//             <div className={styles.dateCell}>
//               <span className={styles.dayNumber}>{dayText}</span>
//               {/* 모든 날짜에 숫자 7 표시 */}
//               <span className={styles.additionalNumber}>7</span>
//             </div>
//           );
//         }}
//         fixedWeekCount={false}
//         height="100%"
//       />
//     </div>
//   );
// };

// // props 타입 검사
// TeacherCalendar.propTypes = {
//   onDateSelect: PropTypes.func.isRequired,
// };

// export default TeacherCalendar;
