import { useEffect, useState } from "react";
import axios from "axios";

export const useApiStubReservationInfo = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    axios
      .get("http://localhost:8081/v1/users/initial", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        console.log("userData", userData);
      })
      .catch((error) => {
        console.error("API 요청 중 에러 발생:", error);
      });
  }, []);

  return { userData };
};

// export const ApiStubReservationList = () => {
//   try {
//     const [userData, setUserData] = useState(null);

//     useEffect(() => {
//       const token = localStorage.getItem("USER_TOKEN");
//       axios
//         .get(`http://localhost:8081/v1//consults/${userData.userId}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `${token}`,
//           },
//         })
//         .then((response) => {
//           setUserData(response.data);
//         })
//         .catch((error) => {
//           console.error("API 요청 중 에러 발생:", error);
//         });
//     }, []);
//     return;
//   } catch (error) {
//     console.error("");
//   }
// };
