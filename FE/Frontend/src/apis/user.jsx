<<<<<<< HEAD
// 예시코드

// import { localAxios } from "@/utils/request";

// const axios = localAxios();

// export const getUser = (nickname, success, fail) => {
//   console.log("getUser");
//   axios.get(`/user/${nickname}`).then(success).catch(fail);
// };
=======
// 로그인은 qurystring으로 요청 보내야함.
import axiosInstance from "../utils/axiosInstance";

const loginUser = (username, password) => {
  const queryString = `username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;
  return axiosInstance.post(
    `http://localhost:8081/v1/auth/login?${queryString}`
  );
};

export { loginUser };
>>>>>>> master
