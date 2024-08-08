import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./InviteCode.module.scss";
import ClassProduceModal from "./ClassProduceModal";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";

const InviteCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          console.error("Failed to fetch profile data:", error);
        }
      };
      fetchData();
    }, []);
    return profileData;
  };

  const profile = useProfile();

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
      console.error("Error deleting classroom", error);
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
    } catch (error) {
      console.error("Error regenerating PIN", error);
      alert("PIN 재발급 실패");
    }
  };

  return (
    <div className={styles.inviteCodeBox}>
      <div className={styles.inviteTxtBox}>
        <h2>{profile.name} 환영합니다</h2>
        <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
      </div>
      <div className={styles.btn}>
      <button className={styles.classBtn} onClick={toggleModal}>
        학급 만들기
      </button>
      <button className={styles.deleteBtn} onClick={classDelete}>
        학급 삭제
      </button>
      <button className={styles.pinArray} onClick={rePin}>
        PIN 재발급
      </button>
      </div>
      {isModalOpen && <ClassProduceModal />}
    </div>
  );
};

export default InviteCode;
