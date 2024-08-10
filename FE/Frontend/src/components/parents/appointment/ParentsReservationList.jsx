import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FiCalendar } from "react-icons/fi";
import useTeacherCalendarStore from "../../../store/TeacherCalendarStore";
import Modal from "./Modal";
import ConsultationButton from "./ConsultationButton";
import styles from "./ParentsReservationList.module.scss";
import { fetchApiRequestReservation } from "../../../apis/stub/55-59 상담/apiStubReservation";

const ParentsReservationList = ({ selectedDate }) => {
  const { consultations, fetchReservations, isAvailable, setConsultations } =
    useTeacherCalendarStore();

  const [showModal, setShowModal] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [consultationDescription, setConsultationDescription] = useState("");
  const [consultationPurpose, setConsultationPurpose] = useState("");

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // selectedDate를 문자열로 변환하여 표시
  const formatDate = (date) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  // 테이블 정보 렌더링
  const renderConsultationRow = (consultation, index) => (
    <div className={styles.row} key={index}>
      <div className={styles.cell}>{consultation.time}</div>
      <div className={styles.cell}>
        <ConsultationButton
          consultation={consultation}
          index={index}
          clickedIndex={clickedIndex}
          onClick={handleClick}
          isAvailable={isAvailable(consultation.status)}
        />
      </div>
    </div>
  );

  // 버튼 클릭 시 실행되는 함수
  const handleClick = (index) => {
    const updatedConsultations = consultations.map((consultation, i) => {
      if (i === index) {
        let newConsultation = { ...consultation };
        if (!isAvailable(consultation.status)) {
          newConsultation.status = null;
        }
        return newConsultation;
      }
      return consultation;
    });
    setConsultations(updatedConsultations);
    setClickedIndex(index);
  };

  // 예약하기 버튼 클릭 시 실행되는 함수: axios요청
  const handleReservation = async () => {
    if (clickedIndex !== null) {
      const selectedConsultation = consultations[clickedIndex];
      const [startTime, endTime] = selectedConsultation.time.split(" ~ ");

      const formattedStartTime = `${formatDate(selectedDate)}T${startTime}:00`;
      const formattedEndTime = `${formatDate(selectedDate)}T${endTime}:00`;

      try {
        await fetchApiRequestReservation(
          consultationDescription,
          formattedStartTime,
          formattedEndTime
        );

        const updatedConsultations = consultations.map((consultation, i) => {
          if (i === clickedIndex) {
            return {
              ...consultation,
              status: "APPLY",
            };
          }
          return consultation;
        });
        setConsultations(updatedConsultations);
        setClickedIndex(null);
        setShowModal(true);
      } catch (error) {
        console.error("예약 생성 실패:", error);
        // 오류 처리 (예: 사용자에게 오류 메시지 표시)
      }
    }
  };

  // 취소 버튼 클릭 시 실행되는 함수
  const handleCancel = () => {
    fetchReservations();
  };

  return (
    <div className={styles.consultationList}>
      <div className={styles.header}>
        <h2>{formatDate(selectedDate)}</h2>
        <FiCalendar className={styles.calendarIcon} />

        <div className={styles.filterContainer}>
          <select
            id="consultationPurpose"
            className={styles.filterSelect}
            value={consultationPurpose}
            onChange={(e) => setConsultationPurpose(e.target.value)}
          >
            <option value="" disabled>
              상담 목적을 선택해주세요!
            </option>
            <option value="정기 상담">정기 상담</option>
            <option value="학교 생활">학교 생활</option>
            <option value="교육 관계">교육 관계</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.cellHeader}>상담 시간</div>
          <div className={styles.cellHeader}>상담 신청</div>
        </div>
        {consultations.map(renderConsultationRow)}
      </div>

      <textarea
        className={styles.consultationInput}
        placeholder="상담 내용을 입력해 주세요. (50자 이내)"
        value={consultationDescription}
        onChange={(e) => setConsultationDescription(e.target.value)}
        maxLength={50}
      />
      <div className={styles.actions}>
        <button
          className={styles.modify}
          onClick={handleReservation}
          disabled={
            !consultationPurpose ||
            !consultationDescription ||
            clickedIndex === null
          }
        >
          예약하기
        </button>
        <button className={styles.cancel} onClick={handleCancel}>
          취소
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

ParentsReservationList.propTypes = {
  selectedDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
};

export default ParentsReservationList;
