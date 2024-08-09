import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./InviteCode.module.scss";
import ClassProduceModal from "./ClassProduceModal";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";

const InviteCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const useProfile = () => {
    const [profileData, setProfileData] = useState({
      name: "",
    });

    // 유저 닉네임
    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem("USER_TOKEN");
        try {
          const response = await axios.get("http://localhost:8081/v1/users", {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          setProfileData({
            name: response.data.name,
          });
        } catch (error) {
          console.error("데이터를 가져오지 못했습니다:", error);
        }
      };
      fetchData();
    }, []);
    return profileData;
  };

  const profile = useProfile();

  // pin 번호 확인
  const useClassInfo = () => {
    useEffect(() => {
      const fetchClassInfo = async () => {
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
          setClassInfo(response.data);
        } catch (error) {
          console.error("클래스 정보를 가져오지 못했습니다:", error);
        }
      };
      fetchClassInfo();
    }, []);
  };

  useClassInfo();

  // 학급 삭제하기
  const classDelete = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const { boardId } = await fetchApiUserInitial();
      await axios.delete(
        `http://localhost:8081/v1/classrooms/teachers/${boardId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      alert("학급이 삭제되었습니다");
    } catch (error) {
      console.error("강의실 삭제 중 오류 발생", error);
      alert("실패");
    }
  };

  // PIN 번호 재발급
  const rePin = async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const { boardId } = await fetchApiUserInitial();
      await axios.put(
        `http://localhost:8081/v1/classrooms/teachers/pin/${boardId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      alert("PIN이 재발급되었습니다");
      location.reload();
    } catch (error) {
      console.error("PIN 재생성 오류 발생", error);
    }
  };

  // 초대 코드 복사하기
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className={styles.inviteCodeBox}>
      <h2>{profile.name}님 환영합니다</h2>
      <div className={styles.btn}>
        {classInfo && classInfo.pin ? (
          <div>
            <div className={styles.copyButton}>
              <h3>초대 코드 {classInfo.pin}</h3>
              <button onClick={() => copyToClipboard(classInfo.pin)}>
                {isCopied ? "복사 완료 ☑" : "코드 복사 ☐"}
              </button>
            </div>
            <div className={styles.btnArray}>
              <button className={styles.pinBtn} onClick={rePin}>
                PIN 재발급
              </button>
              <button className={styles.deleteBtn} onClick={classDelete}>
                학급 삭제
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.btnArray}>
            <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
            <button className={styles.classBtn} onClick={toggleModal}>
              학급 생성
            </button>
          </div>
        )}
      </div>
      {isModalOpen && <ClassProduceModal />}
    </div>
  );
};

export default InviteCode;
