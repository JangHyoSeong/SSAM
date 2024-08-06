// 데이터 요청
import axios from "axios";

// 상담확인
export const fetchApiReservationList = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  // ${teacherId} = 3
  const response = await axios.get("http://localhost:8081/v1/consults/3", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  return response.data; // 응답 데이터 반환
};

// 상담신청
export const fetchApiRequestReservation = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  // ${teacherId} = 3
  const response = await axios.post("http://localhost:8081/v1/consults/3", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  return response.data; // 응답 데이터 반환
};
// hi