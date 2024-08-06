import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TeacherAuthorization.module.scss";
import TeacherApproveModal from "./TeacherApproveModal";
import TeacherRejectModal from "./TeacherRejectModal";
import { useStudentsStore } from "../../../store/StudentsStore"; // 경로 및 named export 확인
import {
  fetchApiStudentsList,
  approveStudentApi,
} from "../../../apis/stub/51-53 학생관리/apiStudents";

const TeacherAuthorization = () => {
  const { students, setStudents } = useStudentsStore((state) => ({
    students: state.students,
    setStudents: state.setStudents,
  }));

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchApiStudentsList();
        console.log("Fetched Students Data:", data);
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students data:", error);
      }
    };

    getData();
  }, [setStudents]);

  const handleApproveClick = (request) => {
    console.log("Selected Request:", request);
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleRejectClick = (request) => {
    console.log("Selected Request:", request);
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleApproveStudent = async () => {
    if (selectedRequest && selectedRequest.studentId) {
      try {
        await approveStudentApi(selectedRequest.studentId); // studentId를 올바르게 전달
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.studentId === selectedRequest.studentId
              ? { ...student, approved: true }
              : student
          )
        );
        setShowApproveModal(false);
      } catch (error) {
        console.error("Failed to approve student:", error);
      }
    } else {
      console.error("Student ID is missing.");
    }
  };

  if (!students.length) {
    return <div>Loading...</div>;
  }

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
            <th className={styles.nameColumn}>신청한 사람</th>
            <th className={styles.idColumn}>아이디</th>
            <th className={styles.dateColumn}>신청일</th>
            <th className={styles.actionColumn}>관리</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td className={styles.nameColumn}>{student.name}</td>
              <td className={styles.idColumn}>{student.username}</td>
              <td className={styles.dateColumn}>{student.followDate}</td>
              <td className={styles.actionColumn}>
                <button
                  className={styles.approveButton}
                  onClick={() => handleApproveClick(student)}
                >
                  승인
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleRejectClick(student)}
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
          request={selectedRequest}
          onClose={() => setShowApproveModal(false)}
          onApprove={handleApproveStudent}
        />
      )}
      {showRejectModal && (
        <TeacherRejectModal
          request={selectedRequest}
          onClose={() => setShowRejectModal(false)}
          onReject={() => {
            setShowRejectModal(false);
            // 추가 거절 로직
          }}
        />
      )}
    </div>
  );
};

export default TeacherAuthorization;
