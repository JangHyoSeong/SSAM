import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TeacherAuthorization.module.scss";
import TeacherApproveModal from "./TeacherApproveModal";
import TeacherRejectModal from "./TeacherRejectModal";
import students from "./students"; // students 모듈을 가져옴

const TeacherAuthorization = () => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([
    { name: "정종화", id: "JJH", date: "24.07.16" },
    { name: "권혜경", id: "KHK", date: "24.07.13" },
    { name: "김동현", id: "KDH", date: "24.07.11" },
    { name: "장효승", id: "JHS", date: "24.07.11" },
    { name: "정유진", id: "JYJ", date: "24.07.07" },
    { name: "박범준", id: "PBJ", date: "24.06.30" },
  ]);

  // 승인 버튼 클릭 시 호출되는 함수
  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  // 승인 모달에서 실제 승인을 처리하는 함수
  const handleApprove = () => {
    // 승인된 요청을 요청 리스트에서 제거
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== selectedRequest.id)
    );

    // students 배열에 새로운 학생 추가하고 정렬
    const newStudent = {
      name: selectedRequest.name,
      birth: "2000.01.01", // 실제 생일 데이터 필요
    };

    // 새로운 학생을 students 배열에 추가
    students.push(newStudent);

    // 한글 이름에 따라 students 배열을 오름차순으로 정렬
    students
      .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"))
      .forEach((student, index) => {
        student.id = index + 1; // id 속성 재설정
        student.number = index + 1; // number 속성 재설정
      });

    // 모달을 닫음
    setShowApproveModal(false);
  };

  // 거절 버튼 클릭 시 호출되는 함수
  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  // 거절 모달에서 실제 거절을 처리하는 함수
  const handleReject = () => {
    // 거절된 요청을 요청 리스트에서 제거
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== selectedRequest.id)
    );
    // 모달을 닫음
    setShowRejectModal(false);
  };

  return (
      <div className={styles.authorizationContainer}>
        <div className={styles.classNavbar}>
          <NavLink
            to="/teacherclassroom"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            학급 관리
          </NavLink>
          <NavLink
            to="/teacherauthorization"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            승인 관리
          </NavLink>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>신청한 사람</th>
              <th>아이디</th>
              <th>신청일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td>{request.name}</td>
                <td>{request.id}</td>
                <td>{request.date}</td>
                <td>
                  <button
                    className={styles.approveButton}
                    onClick={() => handleApproveClick(request)}
                  >
                    승인
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => handleRejectClick(request)}
                  >
                    거절
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showApproveModal && (
          <TeacherApproveModal
            onClose={() => setShowApproveModal(false)}
            onApprove={handleApprove}
          />
        )}
        {showRejectModal && (
          <TeacherRejectModal
            onClose={() => setShowRejectModal(false)}
            onReject={handleReject}
          />
        )}
      </div>
  );
};

export default TeacherAuthorization;
