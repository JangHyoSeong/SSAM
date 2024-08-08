import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./ParentsClassroom.module.scss";
import ParentsStudent from "./ParentsStudent";
import ClassImage from "../../../assets/background.png";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";

const ParentsClassroom = () => {
  const [banner, setBanner] = useState(""); // 학급 배너
  const [notice, setNotice] = useState(""); // 알림 사항

  // 학급 전체 데이터 불러오기
  useEffect(() => {
    const classInfoData = async () => {
      try {
        const token = localStorage.getItem("USER_TOKEN");
        const { boardId } = await fetchApiUserInitial();
        const response = await axios.get(
          `http://localhost:8081/v1/classrooms/${boardId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        const classData = response.data;
        setBanner(classData.banner);
        setNotice(classData.notice);
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
      }
    };
    classInfoData();
  }, []);

  return (
    <div className={styles.classInfoContainer}>
      <div className={styles.imageContainer}>
        <img
          src={ClassImage}
          alt="Class Management"
          className={styles.classImage}
        />
      </div>
      <div className={styles.infoBoxes}>
        <div className={styles.noticeBox}>
          <h2>알림 사항</h2>
          <p>{notice}</p>
        </div>
        <div className={styles.classInfoBox}>
          <h2>학급 사항</h2>
          <p>{banner}</p>
        </div>
        <div className={styles.inquiryBox}>
          <h3>문의사항</h3>
          <p>점심메뉴가 뭔가요: 운영자</p>
          <p>교무실 전화번호 plz: 박범준</p>
          <p>소풍 날짜 언제죠: 조성인</p>
        </div>
      </div>
      <div className={styles.studentListContainer}>
        <ParentsStudent />
      </div>
    </div>
  );
};

export default ParentsClassroom;
