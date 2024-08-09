// src/apis/stub/55-59 상담/apiReservationTime.jsx

import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL

export const fetchSetTime = async (startTime, endTime) => {
  const token = localStorage.getItem("USER_TOKEN");
  const { userId } = await fetchApiUserInitial();


  console.log("Request body:", { topic: "ATTITUDE", startTime, endTime });
  console.log("Authorization token:", token);

  const response = await axios.post(
    `${apiUrl}/v1/consults/${userId}`,
    {
      topic: "ATTITUDE",
      startTime: startTime,
      endTime: endTime,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
