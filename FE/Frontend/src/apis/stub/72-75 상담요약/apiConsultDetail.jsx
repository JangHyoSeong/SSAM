// src/apis/stub/72-75 상담요약/apiConsultDetail.jsx
import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const fetchConsultDetail = async (consultId) => {
  if (!consultId) {
    throw new Error("Invalid consultId");
  }

  const token = localStorage.getItem("USER_TOKEN");
  try {
    const response = await axios.get(
      `${apiUrl}/v1/consults/teachers/${consultId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error.response || error.message);
    throw error;
  }
};
