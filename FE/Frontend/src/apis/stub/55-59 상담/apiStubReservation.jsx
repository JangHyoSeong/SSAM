//src/apis/stub/55-59 상담/apiStubReservation.jsx
// 데이터 요청
import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;

// 상담확인
export const fetchApiReservationList = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const { userId } = await fetchApiUserInitial();
  const response = await axios.get(
    `${apiUrl}/v1/consults/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  return response.data; // 응답 데이터 반환
};

// 상담신청
// export const fetchApiRequestReservation = async () => {
//   const token = localStorage.getItem("USER_TOKEN");
//   const { userId } = await fetchApiUserInitial();
//   const response = await axios.post(
//     `${apiUrl}/v1/consults/${userId}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token}`,
//       },
//     }
//   );
//   return response.data; // 응답 데이터 반환
// };

// 상담 상태 업데이트 (DONE, REJECT 등)
export const updateAppointmentStatus = async (appointmentId) => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.put(
    `${apiUrl}/v1/consults/${appointmentId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  return response.data;
};
