import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./ParentsClassroom.module.scss";
import ClassImage from "../../../assets/background.png";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
import { fetchQuestionList } from "../../../apis/stub/28-31 문의사항/apiOnlyQuestion"; // 수정된 부분
import TeacherStudent from "../../teacher/classroom/TeacherStudent";

const ParentsClassroom = () => {
  const [banner, setBanner] = useState(""); // 학급 배너
  const [notice, setNotice] = useState(""); // 알림 사항
  const [questions, setQuestions] = useState([]); // 문의사항 데이터 추가
  const [selectedStudentId, setSelectedStudentId] = useState(null); // 선택된 학생 ID

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
        const questionResponse = await fetchQuestionList(); // 문의사항 데이터 가져오기
        setQuestions(questionResponse.slice(0, 3)); // 문의사항 데이터 최대 3개 가져오기
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
          <h2>문의사항</h2>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div
                key={index}
                className={styles.inquiryItem}
                onClick={() =>
                  (window.location.href =
                    "http://localhost:3000/teacherquestion")
                }
              >
                <div className={styles.inquiryQuestion}>{question.content}</div>
              </div>
            ))
          ) : (
            <p>아직 질문이 없습니다</p>
          )}
        </div>
      </div>
      <TeacherStudent onSelectStudent={setSelectedStudentId} />
    </div>
  );
};

export default ParentsClassroom;
