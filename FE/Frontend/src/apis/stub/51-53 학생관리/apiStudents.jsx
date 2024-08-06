// apis/stub/51-53 학생관리/apiStudents.jsx
import axios from "axios";

// 학생 리스트
export const fetchApiStudentsList = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.get(
    "http://localhost:8081/v1/classrooms/teachers/students",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  // console.log("API Response:", response.data); // 응답 데이터 콘솔에 출력
  return response.data; // 응답 데이터 반환
};

// 학생 승인 API 호출 함수
export const approveStudentApi = async (studentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  await axios.put(
    `http://localhost:8081/classrooms/teachers/students/${studentId}/approve`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  console.log("API 응답:", response.data); // 응답 데이터 콘솔에 출력
};

// // 학생 거절 API 호출 함수
// export const rejectStudentApi = async (studentId) => {
//   const token = localStorage.getItem("USER_TOKEN");
//   await axios.put(
//     `http://localhost:8081/classrooms/teachers/students/${studentId}/reject`,
//     null,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token}`,
//       },
//     }
//   );
// };
