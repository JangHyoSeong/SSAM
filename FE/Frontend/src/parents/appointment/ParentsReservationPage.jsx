import { useState } from "react";
import ParentsReservationList from "./ParentsReservationList";
import ParentsCalendar from "./ParentsCalendar";
import styles from "./ParentsReservationPage.module.scss";

const ParentsReservationPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableCount, setAvailableCount] = useState(0);

  // 선택된 날짜를 설정하는 함수
  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date));
  };

  // 사용 가능한 상담 횟수를 설정하는 함수
  const handleAvailableCountChange = (count) => {
    setAvailableCount(count);
  };

  return (
    <div>
      <section className={styles.classNavbar}>
        <ParentsCalendar
          onDateSelect={handleDateSelect}
          availableCount={availableCount}
        />
        <ParentsReservationList
          selectedDate={selectedDate}
          onAvailableCountChange={handleAvailableCountChange}
        />
      </section>
    </div>
  );
};

export default ParentsReservationPage;
