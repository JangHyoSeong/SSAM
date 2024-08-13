import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import styles from "./TeacherCalendar.module.scss";
import { useState, useEffect, useRef } from "react";
import { fetchApiReservationList } from "../../../apis/stub/55-59 상담/apiStubReservation";

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

  const getConsultationsCounts = (date) => {
    const filteredConsultations = consultations.filter((consultation) => {
      const consultDate = new Date(consultation.startTime);
      consultDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      return consultDate.getTime() === targetDate.getTime();
    });

    const validStatusCount = filteredConsultations.filter((consultation) =>
      ["APPLY", "ACCEPTED", "DONE"].includes(consultation.status)
    ).length;

    const rejectCount = filteredConsultations.filter(
      (consultation) => consultation.status === "REJECT"
    ).length;

    const totalNonRejectedCount = 7 - rejectCount;

    return { validStatusCount, totalNonRejectedCount };
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
          const { validStatusCount, totalNonRejectedCount } =
            getConsultationsCounts(arg.date);
          return (
            <div className={styles.dateCell}>
              <span className={styles.dayNumber}>{arg.dayNumberText}</span>
              {totalNonRejectedCount > 0 && (
                <span className={styles.additionalNumber}>
                  ({validStatusCount} / {totalNonRejectedCount})
                </span>
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
