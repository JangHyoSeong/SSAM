// 데이터 요청
// -> 데이터 저장 경로: store/UserInitialStore
import axios from "axios";

export const fetchApiUserInitial = async () => {
  const token = localStorage.getItem("USER_TOKEN");
  const response = await axios.get("http://localhost:8081/v1/users/initial", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  return response.data;
};
