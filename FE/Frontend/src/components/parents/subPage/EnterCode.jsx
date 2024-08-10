import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./EnterCode.module.scss";
import ClassEnterModal from "./ClassEnterModal";
const apiUrl = import.meta.env.API_URL;

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
      <div className={styles.welcomeBox}>
        <h3>
          {profile.name}님<br /> 환영합니다
        </h3>
      </div>
      <div className={styles.codeBox}>
        <h3>
          선생님께 받은 초대코드로
          <br /> 학급을 등록하세요.
        </h3>
        <button className={styles.classBtn} onClick={toggleModal}>
          초대코드 입력하기
        </button>
        {isModalOpen && <ClassEnterModal />}
      </div>
      {/* 클릭하면 상담코드로 이동하도록 수정 */}
      <div className={styles.codeBox}>
        <h3>예정된 상담이 있습니다.</h3>
        <button className={styles.classBtn} onClick={toggleModal}>
          상담 시작하기
        </button>
        {isModalOpen && <ClassEnterModal />}
      </div>
    </div>
  );
};
export default EnterCode;
