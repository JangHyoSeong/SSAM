import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AlarmModal.module.scss";

const AlarmModal = () => {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    axios
      .get("http://localhost:8081/v1/alarms", {
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
      })
      .then((response) => setAlarms(response.data))
      .catch((error) => console.error(error));
  }, []);

  const alarmDelete = (alarmId) => {
    const token = localStorage.getItem("USER_TOKEN");
    axios
      .delete(`http://localhost:8081/v1/alarms/${alarmId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
      })
      .then(() => {
        setAlarms((prevAlarms) =>
          prevAlarms.filter((alarm) => alarm.alarmId !== alarmId)
        );
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={styles.alarmArray}>
      <div className={styles.triangle} />
      <div className={styles.titleArray}>알림</div>
      <hr />
      <div className={styles.contentArray}>
        {alarms.map((post) => (
          <div key={post.alarmId} className={styles.content}>
            <div
              className={styles.deleteBtn}
              onClick={() => alarmDelete(post.alarmId)}
            >
              X
            </div>
            <p>{post.alarmTime}</p>
            {post.alarmType === "QUESTION" && (
              <a href="http://localhost:3000/teacherquestion">
                <p>문의사항을 확인해주세요</p>
              </a>
            )}
            {post.alarmType === "ANSWER" && (
              <a href="http://localhost:3000/parentsquestion">
                <p>문의사항을 확인해주세요</p>
              </a>
            )}
            {post.alarmType === "ACCEPT" && (
              <a href="http://localhost:3000/teacherauthorization">
                <p>승인 요청을 보냈습니다</p>
              </a>
            )}
            {post.alarmType === "REGISTRATION" && (
              <a href="http://localhost:3000/parentssubpage">
                <p>승인 요청이 수락되었습니다</p>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlarmModal;
