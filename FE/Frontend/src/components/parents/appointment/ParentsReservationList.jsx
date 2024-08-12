import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FiCalendar } from "react-icons/fi";
import useTeacherCalendarStore, {
  AppointmentTopic,
} from "../../../store/TeacherCalendarStore";
import Modal from "./Modal";
import styles from "./ParentsReservationList.module.scss";
import {
  fetchApiRequestReservation,
  fetchApiCancelReservation,
} from "../../../apis/stub/55-59 상담/apiStubReservation";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";

const ParentsReservationList = ({ selectedDate }) => {
  const {
    consultations,
    setConsultations,
    selectedTopic,
    setSelectedTopic,
    isAvailable,
    fetchReservations,
  } = useTeacherCalendarStore();

  const [showModal, setShowModal] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [consultationDescription, setConsultationDescription] = useState("");
  const [userId, setUserId] = useState(null);

  // 컴포넌트 마운트 시 예약 정보 가져오기
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 사용자 ID 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { userId } = await fetchApiUserInitial();
        setUserId(userId);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  // 상담 버튼 컴포넌트
  const ConsultationButton = ({ consultation, index }) => {
    // 버튼 클릭 핸들러
    const handleClick = async () => {
      if (
        consultation.status === "APPLY" &&
        consultation.studentId === userId
      ) {
        // 상담 취소 로직
        try {
          await fetchApiCancelReservation(consultation.appointmentId);
          const updatedConsultations = consultations.map((c, i) => {
            if (i === index) {
              return { ...c, status: "CANCEL", studentId: null };
            }
            return c;
          });
          setConsultations(updatedConsultations);
        } catch (error) {
          console.error("상담 취소 실패:", error);
        }
      } else {
        // 기존의 신청 로직
        const updatedConsultations = consultations.map((c, i) => {
          if (i === index) {
            return { ...c, status: isAvailable(c.status) ? null : c.status };
          }
          return c;
        });
        setConsultations(updatedConsultations);
        setClickedIndex(index);
      }
    };

    // 버튼 클래스 결정 함수
    const getButtonClasses = () => {
      let buttonClass = styles.consultationButton;
      if (
        consultation.status === "APPLY" &&
        consultation.studentId === userId
      ) {
        buttonClass += ` ${styles.cancel}`;
      } else if (!isAvailable(consultation.status)) {
        buttonClass += ` ${styles.unavailable}`;
      } else if (index === clickedIndex) {
        buttonClass += ` ${styles.clicked}`;
      } else {
        buttonClass += ` ${styles.available}`;
      }
      return buttonClass;
    };

    // 버튼 텍스트 결정
    const getButtonText = () => {
      if (
        consultation.status === "APPLY" &&
        consultation.studentId === userId
      ) {
        return "상담취소";
      } else if (isAvailable(consultation.status)) {
        return "신청가능";
      } else {
        return "신청불가";
      }
    };

    return (
      <button
        className={getButtonClasses()}
        onClick={handleClick}
        disabled={
          !isAvailable(consultation.status) && consultation.studentId !== userId
        }
      >
        {getButtonText()}
      </button>
    );
  };

  // 상담 행 렌더링 함수
  const renderConsultationRow = (consultation, index) => (
    <div className={styles.row} key={index}>
      <div className={styles.cell}>{consultation.time}</div>
      <div className={styles.cell}>
        <ConsultationButton consultation={consultation} index={index} />
      </div>
    </div>
  );

  // 예약 처리 함수
  const handleReservation = async (event) => {
    event.preventDefault();
    if (clickedIndex !== null) {
      const selectedConsultation = consultations[clickedIndex];
      const [startTime, endTime] = selectedConsultation.time.split(" ~ ");

      const formattedStartTime = `${formatDate(selectedDate)}T${startTime}:00`;
      const formattedEndTime = `${formatDate(selectedDate)}T${endTime}:00`;

      try {
        // API를 통해 예약 요청
        await fetchApiRequestReservation(
          selectedTopic,
          consultationDescription,
          formattedStartTime,
          formattedEndTime
        );

        // 상담 목록 업데이트
        const updatedConsultations = consultations.map((consultation, i) => {
          if (i === clickedIndex) {
            return {
              ...consultation,
              status: "APPLY",
              studentId: userId, // 예약한 학생 ID 설정
            };
          }
          return consultation;
        });
        setConsultations(updatedConsultations);
        setClickedIndex(null);
        setShowModal(true);

        // 입력 필드 초기화
        setConsultationDescription("");
        setSelectedTopic("");
      } catch (error) {
        console.error("예약 생성 실패:", error);
      }
    }
  };

  // 취소 버튼 핸들러
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
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">상담 목적을 선택해주세요!</option>
            <option value={AppointmentTopic.FRIEND}>교우 관계</option>
            <option value={AppointmentTopic.BULLYING}>학교 폭력</option>
            <option value={AppointmentTopic.SCORE}>성적</option>
            <option value={AppointmentTopic.CAREER}>진로</option>
            <option value={AppointmentTopic.ATTITUDE}>학습 태도</option>
            <option value={AppointmentTopic.OTHER}>기타</option>
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
            !selectedTopic || !consultationDescription || clickedIndex === null
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
