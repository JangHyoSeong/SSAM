import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./ClassEnterModal.module.scss";
import Swal from "sweetalert2";

const ClassEnterModal = () => {
  const [pins, setPins] = useState(Array(6).fill(""));
  const [classroom, setClassroom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState("초대코드를 입력해주세요."); // 초기 메시지를 설정합니다.
  const inputRefs = useRef(new Array(6));
  const apiUrl = import.meta.env.API_URL;

  // PIN 번호 GET
  useEffect(() => {
    const fetchClassroom = async () => {
      const pin = pins.join("");
      if (pin.length === 0) {
        setErrorMessage("초대코드를 입력해주세요."); // 아무 글자도 입력되지 않았을 때
        setClassroom(null);
      } else if (pin.length === 6) {
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
            setErrorMessage(null); // 성공 시 오류 메시지 초기화
            console.log(response.data);
          } else {
            console.error("제공된 PIN과 일치하는 강의실을 찾을 수 없습니다");
            setClassroom(null);
            setErrorMessage("일치하는 학급이 없습니다.");
          }
        } catch (error) {
          console.error("Axios 실패: ", error.response || error);
          setClassroom(null);
          setErrorMessage("일치하는 학급이 없습니다.");
        }
      } else {
        setClassroom(null); // 핀 번호가 6자리가 아닐 때 classroom 상태를 초기화
        setErrorMessage("일치하는 학급이 없습니다."); // 오류 메시지를 설정
      }
    };
    fetchClassroom();
  }, [pins]);

  const pinChange = (index) => (e) => {
    const value = e.target.value; // 입력된 값을 가져옴
    const newPins = [...pins];

    if (e.key === "Backspace" || e.key === "Delete") {
      // 백스페이스와 삭제 키 처리
      newPins[index] = ""; // 현재 칸의 값을 지움
      setPins(newPins);
      if (index > 0 && pins[index] === "") {
        inputRefs.current[index - 1].focus(); // 이전 칸으로 포커스를 이동
      }
    } else if (e.key === "ArrowLeft") {
      // 왼쪽 화살표 처리
      if (index > 0) {
        inputRefs.current[index - 1].focus(); // 이전 칸으로 포커스를 이동
      }
    } else if (e.key === "ArrowRight") {
      // 오른쪽 화살표 처리
      if (index < 5) {
        inputRefs.current[index + 1].focus(); // 다음 칸으로 포커스를 이동
      }
    } else if (value.length > 1) {
      // 복사-붙여넣기 처리
      for (let i = 0; i < value.length && index + i < 6; i++) {
        newPins[index + i] = value[i];
      }
      setPins(newPins);

      // 다음 입력 칸으로 포커스 이동
      if (index + value.length < 6) {
        inputRefs.current[index + value.length].focus();
      }
    } else {
      // 단일 문자 입력 처리
      newPins[index] = value;
      setPins(newPins);
      if (index < 5 && value) {
        inputRefs.current[index + 1].focus();
      }
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
      Swal.fire({
        title: "등록 완료!",
        text: "선생님께 승인 요청을 보냈습니다",
        icon: "success",
      }).then(function (isConfirm) {
        if (isConfirm) {
          location.reload();
        }
      });
    } catch (error) {
      console.error("실패", error);
      setErrorMessage("일치하는 학급이 없습니다."); // POST 요청이 실패할 경우에도 오류 메시지 표시
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
                maxLength="6"
                value={pins[index]}
                onChange={pinChange(index)}
                onKeyDown={pinChange(index)}
                className={styles.inputBox}
                ref={(el) => (inputRefs.current[index] = el)}
                autoFocus={index === 0}
              />
            ))}
          </form>
          <div className={styles.classInfo}>
            {classroom ? (
              <div>
                <p>{classroom.schoolName}</p>
                <p>
                  {classroom.grade}학년 {classroom.classroom}반
                </p>
                <p>{classroom.teacherName} 선생님</p>
                {classroom.teacherImage && (
                  <img
                    src={classroom.teacherImage}
                    alt="Teacher"
                    className={styles.teacherImage}
                  />
                )}
              </div>
            ) : (
              errorMessage && <p>{errorMessage}</p> // 오류 메시지 표시
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
