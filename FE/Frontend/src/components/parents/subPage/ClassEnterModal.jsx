import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./ClassEnterModal.module.scss";

const ClassEnterModal = () => {
  // 상태 관리: PIN 번호를 입력받을 배열, 선택된 학급 정보, 모달의 표시 여부
  const [pins, setPins] = useState(Array(6).fill(""));
  const [classroom, setClassroom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const inputRefs = useRef(new Array(6)); // 입력창 참조 배열
  const pin = pins.join(""); // PIN 번호를 하나의 문자열로 결합

  // PIN 번호가 완성되면 학급 정보를 가져오는 함수
  useEffect(() => {
    const fetchClassroom = async () => {
      if (pin.length === 6) {
        try {
          const token = localStorage.getItem("USER_TOKEN"); // 로컬 스토리지에서 토큰을 가져옴
          console.log("Using token: ", token);
          const response = await axios.get(
            `http://localhost:8081/v1/classrooms/pin/${pin}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );
          if (response.data) {
            setClassroom(response.data); // 학급 정보 설정
            console.log(response.data);
          } else {
            console.error("No matching classroom found with the provided PIN");
            setClassroom(null);
          }
        } catch (error) {
          console.error("Axios error: ", error.response || error);
          setClassroom(null);
        }
      }
    };
    fetchClassroom();
  }, [pin]);

  // PIN 입력 시 동작하는 함수
  const pinChange = (index) => (e) => {
    const newPins = [...pins];
    newPins[index] = e.target.value.slice(0, 1); // 입력값을 1자리로 제한
    setPins(newPins);
    if (index < 5 && e.target.value) {
      inputRefs.current[index + 1].focus(); // 다음 입력창으로 포커스 이동
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    isModalVisible && (
      <div className={styles.modalArray}>
        <div className={styles.enterArray}>
          <div className={styles.headerArray}>
            <p>초대코드로 학급 검색하기</p>
            <p className={styles.outBtn} onClick={closeModal}>
              X
            </p>
          </div>
          <form id="numberForm" className={styles.inputForm}>
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
              <div className={styles.classroomDetails}>
                <p>School Name: {classroom.schoolName}</p>
                <p>Grade: {classroom.grade}</p>
                <p>Classroom: {classroom.classroom}</p>
                <p>Teacher: {classroom.teacherName}</p>
              </div>
            )}
          </div>
          <button className={styles.registComplete}>등록 완료</button>
        </div>
      </div>
    )
  );
};

export default ClassEnterModal;
