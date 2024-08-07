// src/apis/stub/47-49 학생관리/apiStudentDetail.jsx
import axios from "axios";

export const fetchStudentDetail = async (studentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.get(
    `http://localhost:8081/v1/classrooms/teachers/students/${studentId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
