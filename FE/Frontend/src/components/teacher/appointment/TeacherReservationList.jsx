import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./TeacherReservationList.module.scss";
import { FiCalendar } from "react-icons/fi";
import useReservationTimeStore from "../../../store/ReservationTimeStore";
import { fetchSetTime } from "../../../apis/stub/55-59 상담/apiReservationTime";
import { fetchApiReservationList } from "../../../apis/stub/55-59 상담/apiStubReservation";

const TeacherReservationList = ({ selectedDate }) => {
  const formatDate = (date) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  const formattedDate = formatDate(selectedDate);

  const reservations = useReservationTimeStore(
    (state) => state.reservationsByDate[formattedDate] || []
  );
  const setReservationsForDate = useReservationTimeStore(
    (state) => state.setReservationsForDate
  );
  const toggleAvailabilityForDate = useReservationTimeStore(
    (state) => state.toggleAvailabilityForDate
  );

  // 로컬 스토리지 및 서버에서 예약 상태를 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      const savedReservations = localStorage.getItem(
        `reservations_${formattedDate}`
      );
      if (savedReservations) {
        setReservationsForDate(formattedDate, JSON.parse(savedReservations));
      } else {
        // 서버에서 예약 상태 불러오기
        const serverReservations = await fetchApiReservationList();
        const initialReservations = [
          { time: "14:00 ~ 14:20", available: true },
          { time: "14:30 ~ 14:50", available: true },
          { time: "15:00 ~ 15:20", available: true },
          { time: "15:30 ~ 15:50", available: true },
          { time: "16:00 ~ 16:20", available: true },
          { time: "16:30 ~ 16:50", available: true },
          { time: "17:00 ~ 17:20", available: true },
        ];

        // 서버에서 불러온 예약 상태와 비교하여 상태 설정
        serverReservations.forEach((reservation) => {
          const reservationDate = reservation.startTime.split("T")[0];
          const reservationTime = `${reservation.startTime
            .split("T")[1]
            .slice(0, 5)} ~ ${reservation.endTime.split("T")[1].slice(0, 5)}`;
          if (
            reservationDate === formattedDate &&
            reservation.status === "REJECT"
          ) {
            const index = initialReservations.findIndex(
              (r) => r.time === reservationTime
            );
            if (index !== -1) {
              initialReservations[index].available = false;
            }
          }
        });

        setReservationsForDate(formattedDate, initialReservations);
        localStorage.setItem(
          `reservations_${formattedDate}`,
          JSON.stringify(initialReservations)
        );
      }
    };

    fetchReservations();
  }, [formattedDate, setReservationsForDate]);

  const handleReservation = async (index) => {
    const reservation = reservations[index];
    const startTime = `${formatDate(selectedDate)}T${
      reservation.time.split(" ~ ")[0]
    }:00`;
    const endTime = `${formatDate(selectedDate)}T${
      reservation.time.split(" ~ ")[1]
    }:00`;

    console.log("Reservation startTime:", startTime);
    console.log("Reservation endTime:", endTime);

    try {
      const response = await fetchSetTime(startTime, endTime);
      console.log("예약 성공:", response);

      // 예약 성공 시 상담 가능 상태를 상담 불가로 변경
      toggleAvailabilityForDate(formattedDate, index);

      // 변경된 상태를 로컬 스토리지에 저장
      const updatedReservations = reservations.map((reservation, i) =>
        i === index
          ? { ...reservation, available: !reservation.available }
          : reservation
      );
      localStorage.setItem(
        `reservations_${formattedDate}`,
        JSON.stringify(updatedReservations)
      );
    } catch (error) {
      console.error("예약 실패:", error);
    }
  };

  return (
    <div className={styles.consultationList}>
      <div className={styles.header}>
        <h2>{formattedDate}</h2>
        <FiCalendar className={styles.calendarIcon} />
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.cellHeader}>상담 시간</div>
          <div className={styles.cellHeader}>상담 신청</div>
        </div>
        {reservations.map((reservation, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.consultationBox}>
              <div className={styles.time}>{reservation.time}</div>
              <div className={styles.buttonContainer}>
                <button
                  className={
                    reservation.available
                      ? styles.available
                      : styles.unavailable
                  }
                  onClick={() => {
                    if (reservation.available) {
                      handleReservation(index);
                    } else {
                      toggleAvailabilityForDate(formattedDate, index);

                      // 상태가 변경되면 로컬 스토리지에 저장
                      const updatedReservations = reservations.map(
                        (reservation, i) =>
                          i === index
                            ? {
                                ...reservation,
                                available: !reservation.available,
                              }
                            : reservation
                      );
                      localStorage.setItem(
                        `reservations_${formattedDate}`,
                        JSON.stringify(updatedReservations)
                      );
                    }
                  }}
                >
                  {reservation.available ? "신청 가능" : "신청 불가"}
                </button>
              </div>
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

TeacherReservationList.propTypes = {
  selectedDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
};

export default TeacherReservationList;
