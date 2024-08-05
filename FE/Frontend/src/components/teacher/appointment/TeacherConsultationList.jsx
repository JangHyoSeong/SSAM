import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
//
import { fetchApiReservationList } from "../../../apis/stub/54-57 상담/apiStubReservation";
import useConsultationStore from "../../../store/ConsultationStore";
//
import ConsultationApproveModal from "./ConsultationApproveModal";
import ConsultationRejectModal from "./ConsultationRejectModal";
import styles from "./TeacherConsultationList.module.scss";

const ConsultationItem = ({
  date,
  time,
  studentName,
  subject,
  content,
  onApprove,
  onReject,
  status,
}) => {
  return (
    <div className={styles.consultationRow}>
      <div className={styles.cell}>{date}</div>
      <div className={styles.cellSmall}>{time}</div>
      <div className={styles.cellSmall}>{studentName}</div>
      <div className={styles.cellMedium}>{subject}</div>
      <div className={styles.cellLarge}>{content}</div>
      <div className={styles.cellButtons}>
        {status === "approved" ? (
          <NavLink to="/webrtc" className={styles.statusButton}>
            상담 하기
          </NavLink>
        ) : (
          <>
            <button className={styles.approveButton} onClick={onApprove}>
              승인
            </button>
            <button className={styles.editButton} onClick={onReject}>
              거절
            </button>
          </>
        )}
      </div>
    </div>
  );
};

ConsultationItem.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

const TeacherConsultationList = () => {
  //
  const { reservationData, setReservationData } = useConsultationStore(
    (state) => ({
      reservationData: state.reservationData,
      setReservationData: state.setReservationData,
    })
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchApiReservationList();
        console.log("Fetched data:", data); // 데이터 확인
        setReservationData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getData();
  }, [setReservationData]);

  console.log("Current reservation data:", reservationData); // 상태 확인

  if (!reservationData) {
    return <div>Loading...</div>;
  }
  // 밑에 주석 풀려면 이 return문을 아래의 return문과 합치면됨
  return (
    <div>
      <h1>상담 목록</h1>
      {reservationData.map((item) => (
        <div key={item.appointmentId}>
          <h2>Topic: {item.topic}</h2>
          <h3>Status: {item.status}</h3>
          <p>Appointment ID: {item.appointmentId}</p>
          <p>Start Time: {new Date(item.startTime).toLocaleString()}</p>
          <p>End Time: {new Date(item.endTime).toLocaleString()}</p>
          <p>Student ID: {item.studentId}</p>
          <p>Teacher ID: {item.teacherId}</p>
        </div>
      ))}
    </div>
  );

  //
  //   const initialConsultations = [
  //     {
  //       date: "2024-07-15",
  //       time: "15:00 ~ 15:20",
  //       studentName: "박범준",
  //       subject: "학교 생활",
  //       content: "우리 아이가 잘 지내고 있는지 궁금해요",
  //     },
  //     {
  //       date: "2024-07-16",
  //       time: "16:00 ~ 16:20",
  //       studentName: "김철수",
  //       subject: "학교 생활",
  //       content: "우리 아이가 잘 지내고 있는지 궁금해요",
  //     },
  //   ];

  //   // 상태 함수 정의를 컴포넌트 내부로 이동
  //   const [consultations, setConsultations] = useState(initialConsultations);
  //   const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  //   const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  //   const [selectedConsultationIndex, setSelectedConsultationIndex] =
  //     useState(null);
  //   const [consultationStatus, setConsultationStatus] = useState(
  //     initialConsultations.map(() => ({ status: "pending" }))
  //   );

  //   const handleApprove = (index) => {
  //     setSelectedConsultationIndex(index);
  //     setApproveModalOpen(true);
  //   };

  //   const handleReject = (index) => {
  //     setSelectedConsultationIndex(index);
  //     setRejectModalOpen(true);
  //   };

  //   const closeApproveModal = () => {
  //     setApproveModalOpen(false);
  //   };

  //   const closeRejectModal = () => {
  //     setRejectModalOpen(false);
  //   };

  //   const approveConsultation = () => {
  //     setConsultationStatus((prevStatus) => {
  //       const newStatus = [...prevStatus];
  //       newStatus[selectedConsultationIndex].status = "approved";
  //       return newStatus;
  //     });
  //     setApproveModalOpen(false);
  //   };

  //   const rejectConsultation = () => {
  //     setConsultations((prevConsultations) => {
  //       const newConsultations = prevConsultations.filter(
  //         (_, index) => index !== selectedConsultationIndex
  //       );
  //       return newConsultations;
  //     });
  //     setConsultationStatus((prevStatus) => {
  //       const newStatus = [...prevStatus];
  //       newStatus.splice(selectedConsultationIndex, 1);
  //       return newStatus;
  //     });
  //     setRejectModalOpen(false);
  //   };

  //   const toggleStatus = (index) => {
  //     setConsultationStatus((prevStatus) => {
  //       const newStatus = [...prevStatus];
  //       newStatus[index].status =
  //         newStatus[index].status === "approved" ? "completed" : "approved";
  //       return newStatus;
  //     });
  //   };

  //   return (
  //     <div className={styles.consultationlistContainer}>
  //       <nav className={styles.classNavbar}>
  //         <NavLink
  //           to="/teacherreservationmanagement"
  //           className={({ isActive }) =>
  //             isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
  //           }
  //         >
  //           예약 관리
  //         </NavLink>
  //         <NavLink
  //           to="/teacherconsultationlist"
  //           className={({ isActive }) =>
  //             isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
  //           }
  //         >
  //           상담 목록
  //         </NavLink>
  //       </nav>
  //       <section className={styles.consultationSection}>
  //         <header className={styles.headerRow}>
  //           <h3 className={styles.cellHeader}>날짜</h3>
  //           <h3 className={styles.cellHeaderSmall}>시간</h3>
  //           <h3 className={styles.cellHeaderSmall}>이름</h3>
  //           <h3 className={styles.cellHeaderMedium}>주제</h3>
  //           <h3 className={styles.cellHeaderLarge}>내용</h3>
  //           <h3 className={styles.cellHeaderButtons}>관리</h3>
  //         </header>
  //         {consultations.map((consultation, index) => (
  //           <ConsultationItem
  //             key={index}
  //             date={consultation.date}
  //             time={consultation.time}
  //             studentName={consultation.studentName}
  //             subject={consultation.subject}
  //             content={consultation.content}
  //             onApprove={() => handleApprove(index)}
  //             onReject={() => handleReject(index)}
  //             onToggleStatus={() => toggleStatus(index)}
  //             status={consultationStatus[index].status}
  //           />
  //         ))}
  //       </section>
  //       {isApproveModalOpen && (
  //         <ConsultationApproveModal
  //           onClose={closeApproveModal}
  //           onApprove={approveConsultation}
  //         />
  //       )}
  //       {isRejectModalOpen && (
  //         <ConsultationRejectModal
  //           onClose={closeRejectModal}
  //           onReject={rejectConsultation}
  //         />
  //       )}
  //     </div>
  //   );
  // };
};
export default TeacherConsultationList;

// 백업코드
// 백업코드
// 백업코드
// 백업코드
// 백업코드
// const initialConsultations = [
//   {
//     date: "2024-07-15",
//     time: "15:00 ~ 15:20",
//     studentName: "박범준",
//     subject: "학교 생활",
//     content: "우리 아이가 잘 지내고 있는지 궁금해요",
//   },
//   {
//     date: "2024-07-16",
//     time: "16:00 ~ 16:20",
//     studentName: "김철수",
//     subject: "학교 생활",
//     content: "우리 아이가 잘 지내고 있는지 궁금해요",
//   },
// ];

// const [consultations, setConsultations] = useState(initialConsultations);
// const [isApproveModalOpen, setApproveModalOpen] = useState(false);
// const [isRejectModalOpen, setRejectModalOpen] = useState(false);
// const [selectedConsultationIndex, setSelectedConsultationIndex] =
//   useState(null);
// const [consultationStatus, setConsultationStatus] = useState(
//   initialConsultations.map(() => ({ status: "pending" }))
// );

// const handleApprove = (index) => {
//   setSelectedConsultationIndex(index);
//   setApproveModalOpen(true);
// };

// const handleReject = (index) => {
//   setSelectedConsultationIndex(index);
//   setRejectModalOpen(true);
// };

// const closeApproveModal = () => {
//   setApproveModalOpen(false);
// };

// const closeRejectModal = () => {
//   setRejectModalOpen(false);
// };

// const approveConsultation = () => {
//   setConsultationStatus((prevStatus) => {
//     const newStatus = [...prevStatus];
//     newStatus[selectedConsultationIndex].status = "approved";
//     return newStatus;
//   });
//   setApproveModalOpen(false);
// };

// const rejectConsultation = () => {
//   setConsultations((prevConsultations) => {
//     const newConsultations = prevConsultations.filter(
//       (_, index) => index !== selectedConsultationIndex
//     );
//     return newConsultations;
//   });
//   setConsultationStatus((prevStatus) => {
//     const newStatus = [...prevStatus];
//     newStatus.splice(selectedConsultationIndex, 1);
//     return newStatus;
//   });
//   setRejectModalOpen(false);
// };

// const toggleStatus = (index) => {
//   setConsultationStatus((prevStatus) => {
//     const newStatus = [...prevStatus];
//     newStatus[index].status =
//       newStatus[index].status === "approved" ? "completed" : "approved";
//     return newStatus;
//   });
// };

// return (
//   <div className={styles.consultationlistContainer}>
//     <nav className={styles.classNavbar}>
//       <NavLink
//         to="/teacherreservationmanagement"
//         className={({ isActive }) =>
//           isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
//         }
//       >
//         예약 관리
//       </NavLink>
//       <NavLink
//         to="/teacherconsultationlist"
//         className={({ isActive }) =>
//           isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
//         }
//       >
//         상담 목록
//       </NavLink>
//     </nav>
//     <section className={styles.consultationSection}>
//       <header className={styles.headerRow}>
//         <h3 className={styles.cellHeader}>날짜</h3>
//         <h3 className={styles.cellHeaderSmall}>시간</h3>
//         <h3 className={styles.cellHeaderSmall}>이름</h3>
//         <h3 className={styles.cellHeaderMedium}>주제</h3>
//         <h3 className={styles.cellHeaderLarge}>내용</h3>
//         <h3 className={styles.cellHeaderButtons}>관리</h3>
//       </header>
//       {consultations.map((consultation, index) => (
//         <ConsultationItem
//           key={index}
//           date={consultation.date}
//           time={consultation.time}
//           studentName={consultation.studentName}
//           subject={consultation.subject}
//           content={consultation.content}
//           onApprove={() => handleApprove(index)}
//           onReject={() => handleReject(index)}
//           onToggleStatus={() => toggleStatus(index)}
//           status={consultationStatus[index].status}
//         />
//       ))}
//     </section>
//     {isApproveModalOpen && (
//       <ConsultationApproveModal
//         onClose={closeApproveModal}
//         onApprove={approveConsultation}
//       />
//     )}
//     {isRejectModalOpen && (
//       <ConsultationRejectModal
//         onClose={closeRejectModal}
//         onReject={rejectConsultation}
//       />
//     )}
//   </div>
// );
// };

// export default TeacherConsultationList;
