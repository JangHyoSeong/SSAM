import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AlarmModal.module.scss";

const AlarmModal = () => {
  const [alarms, setAlarms] = useState([]);

  // 알람 목록 GET
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

  // 알람 삭제 DELETE
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
      {/* <div className={styles.triangle}></div> */}
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
              {post.alarmType === "QUESTION" && ( // 질문이 생성됐음 (선생 입장)
                <a href="http://localhost:3000/teacherquestion">
                  <p>문의사항을 확인해주세요</p>
                </a>
              )}
              {post.alarmType === "ANSWER" && ( // 질문에 정답 달렸다고 알림 (학생 입장)
                <a href="http://localhost:3000/studentquestion">
                  <p>문의사항을 확인해주세요</p>
                </a>
              )}
              {post.alarmType === "REGISTRATION" && ( // 학급에 등록 요청이 왔음 (선생님 입장)
                <a href="http://localhost:3000/teacherauthorization">
                  <p>승인 요청을 보냈습니다</p>
                </a>
              )}
              {post.alarmType === "ACCEPT" && ( // 자신의 등록이 승락되었음 (학생입장)
                <a href="http://localhost:3000/studentsubpage">
                  <p>승인 요청이 수락되었습니다</p>
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
