import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./EnterCode.module.scss";
import ClassEnterModal from "./ClassEnterModal";
const apiUrl = import.meta.env.API_URL

const EnterCode = () => {
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
          const response = await axios.get(`${apiUrl}/v1/users`, {
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

  return (
    <div className={styles.EnterArray}>
      <h2>{profile.name}님 환영합니다</h2>
      <h3>선생님께 받은 초대코드로 학급을 등록하세요.</h3>
      <button className={styles.classBtn} onClick={toggleModal}>
        초대코드 입력하기
      </button>
      {isModalOpen && <ClassEnterModal />}
    </div>
  );
};
export default EnterCode;
