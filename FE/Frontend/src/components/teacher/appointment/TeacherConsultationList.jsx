import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
//api
import { fetchApiReservationList } from "../../../apis/stub/54-57 상담/apiStubReservation";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
// store
import useConsultationStore from "../../../store/ConsultationStore";
import useUserInitialStore from "../../../store/UserInitialStore";
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

// 여기부터 추가한 코드입니다.
const TeacherConsultationList = () => {
  // 상담 목록 정보
  const { reservationData, setReservationData } = useConsultationStore(
    (state) => ({
      reservationData: state.reservationData,
      setReservationData: state.setReservationData,
    })
  );
  // 사용자 초기 정보
  const { userInitialData, setUserInitialData } = useUserInitialStore(
    (state) => ({
      userInitialData: state.userInitialData,
      setUserInitialData: state.setUserInitialData,
    })
  );

  // 데이터 사용
  useEffect(() => {
    const getData = async () => {
      try {
        const [reservationList, userInitial] = await Promise.all([
          fetchApiReservationList(),
          fetchApiUserInitial(),
        ]);
        // 데이터 잘 받는지 확인
        console.log("Fetched reservation data:", reservationList);
        console.log("Fetched user initial data:", userInitial);
        setReservationData(reservationList);
        setUserInitialData(userInitial);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getData();
  }, [setReservationData, setUserInitialData]);

  if (!userInitialData) {
    return <div>Loading user initial data...</div>;
  }

  if (!reservationData || reservationData.length === 0) {
    return <div>Loading reservations or no reservations available...</div>;
  }

  // 밑에 주석 풀려면 이 return문을 아래의 return문과 합치면됨
  return (
    <div>
      <h1>상담 목록</h1>
      {/* 상담 목록은 배열이라서 map을 사용한다. */}
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

      <h1>유저목록</h1>
      {/* 유저 목록은 객체라서 map사용하면 안된다. */}
      <pre>{JSON.stringify(userInitialData, null, 2)}</pre>
      {/* <p>User ID: {userInitialData.userId}</p>
      <p>Username: {userInitialData.username}</p>
      <p>Name: {userInitialData.name}</p>
      <p>School: {userInitialData.school}</p>
      <p>Board ID: {userInitialData.boardId}</p>
      <p>Role: {userInitialData.role}</p> */}
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
