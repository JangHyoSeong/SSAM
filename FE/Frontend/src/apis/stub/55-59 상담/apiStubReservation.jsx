// 데이터 요청
import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";

// 상담확인
export const fetchApiReservationList = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const { userId } = await fetchApiUserInitial();
  const response = await axios.get(
    `http://localhost:8081/v1/consults/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  console.log(response.data);
  return response.data; // 응답 데이터 반환
};

// 상담신청
// export const fetchApiRequestReservation = async () => {
//   const token = localStorage.getItem("USER_TOKEN");
//   const { userId } = await fetchApiUserInitial();
//   const response = await axios.post(
//     `http://localhost:8081/v1/consults/${userId}`,
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
    `http://localhost:8081/v1/consults/${appointmentId}`,
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
