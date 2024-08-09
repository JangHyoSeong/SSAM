import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AlarmModal.module.scss";
const apiUrl = import.meta.env.API_URL;

const AlarmModal = () => {
  const [alarms, setAlarms] = useState([]);

  // 알람 목록 GET
  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    axios
      .get(`${apiUrl}/v1/alarms`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
      })
      .then((response) => setAlarms(response.data))
      .catch((error) => console.error(error));
  }, []);

  // 알람 삭제 DELETE
  const alarmDelete = (alarmId) => {
    const token = localStorage.getItem("USER_TOKEN");
    axios
      .delete(`${apiUrl}/v1/alarms/${alarmId}`, {
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
      <div className={styles.triangle}></div>
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
            <div className={styles.postContent}>
              <p>
                {post.alarmTime.split("T")[0]} {post.alarmTime.split("T")[1]}
              </p>
              {post.alarmType === "QUESTION" && (
                <a href={`${apiUrl}/teacherquestion`}>
                  <p>Please check your inquiry</p>
                </a>
              )}
              {post.alarmType === "ANSWER" && (
                <a href={`${apiUrl}/studentquestion`}>
                  <p>Please check your inquiry</p>
                </a>
              )}
              {post.alarmType === "REGISTRATION" && (
                <a href={`${apiUrl}/teacherauthorization`}>
                  <p>Your approval request has been sent</p>
                </a>
              )}
              {post.alarmType === "ACCEPT" && (
                <a href={`${apiUrl}/studentsubpage`}>
                  <p>Your approval request has been accepted</p>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlarmModal;
