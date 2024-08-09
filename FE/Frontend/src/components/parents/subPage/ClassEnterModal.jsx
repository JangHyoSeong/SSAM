import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./ClassEnterModal.module.scss";

const ClassEnterModal = () => {
  const [pins, setPins] = useState(Array(6).fill(""));
  const [classroom, setClassroom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const inputRefs = useRef(new Array(6));
  const pin = pins.join("");
  const apiUrl = import.meta.env.API_URL;

  // PIN 번호 GET
  useEffect(() => {
    const fetchClassroom = async () => {
      if (pin.length === 6) {
        try {
          const token = localStorage.getItem("USER_TOKEN");
          const response = await axios.get(
            `${apiUrl}/v1/classrooms/pin/${pin}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );
          if (response.data) {
            setClassroom(response.data);
            console.log(response.data);
          } else {
            console.error("제공된 PIN과 일치하는 강의실을 찾을 수 없습니다");
            setClassroom(null);
          }
        } catch (error) {
          console.error("Axios 실패: ", error.response || error);
          setClassroom(null);
        }
      }
    };
    fetchClassroom();
  }, [pin]);

  const pinChange = (index) => (e) => {
    const newPins = [...pins];
    newPins[index] = e.target.value.slice(0, 1);
    setPins(newPins);
    if (index < 5 && e.target.value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // 학급 입장하기 POST
  const classRegistration = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      console.log(token);
      await axios.post(
        `${apiUrl}/v1/classrooms/${classroom.boardId}`,
        {}, // 빈 객체를 요청 본문으로 전달 (body가 빈 값이라면 {}를 추가해야함)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      alert("성공");
      location.reload();
    } catch (error) {
      console.error("실패", error);
    }
  };

  return (
    isModalVisible && (
      <div className={styles.modalArray}>
        <div className={styles.enterArray}>
          <div className={styles.headerArray}>
            <p>초대코드로 학급 검색하기</p>
            <h2 className={styles.outBtn} onClick={closeModal}>
              X
            </h2>
          </div>
          <form className={styles.inputForm}>
            {pins.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={pins[index]}
                onChange={pinChange(index)}
                className={styles.inputBox}
                ref={(el) => (inputRefs.current[index] = el)}
                autoFocus={index === 0}
              />
            ))}
          </form>
          <div className={styles.classInfo}>
            {classroom && (
              <div>
                <p>학교 : {classroom.schoolName}</p>
                <p>
                  학급 : {classroom.grade}학년 {classroom.classroom}반
                </p>
                <p>선생님 : {classroom.teacherName}</p>
              </div>
            )}
          </div>
          <button className={styles.registComplete} onClick={classRegistration}>
            등록 완료
          </button>
        </div>
      </div>
    )
  );
};

export default ClassEnterModal;
