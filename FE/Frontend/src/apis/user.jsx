// 예시코드

// import { localAxios } from "@/utils/request";

// const axios = localAxios();

// export const getUser = (nickname, success, fail) => {
//   console.log("getUser");
//   axios.get(`/user/${nickname}`).then(success).catch(fail);
// };

// import axiosConfig from "../utils/axiosConfig";

import axios from "axios";

const loginUser = (username, password) => {
  return axios.post("http://localhost:8081/v1/auth/login", {
    username: username,
    password: password,
  });
};

export { loginUser };
