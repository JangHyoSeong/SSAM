// src/apis/stub/47-49 학생관리/apiStudentDelete.jsx
import axios from "axios";

export const fetchStudentDelete = async (studentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.delete(
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
