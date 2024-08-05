import { useEffect, useState } from "react";
import axios from "axios";

const ApiStubReservation = () => {
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
      })
      .catch((error) => {
        console.error("API 요청 중 에러 발생:", error);
      });
  }, []);

  return (
    <div>
      {userData && (
        <div>
          <p>
            <strong>ID:</strong> {userData.userId}
          </p>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>School:</strong> {userData.school}
          </p>
          <p>
            <strong>Board ID:</strong> {userData.boardId}
          </p>
          <p>
            <strong>Role:</strong> {userData.role}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiStubReservation;
