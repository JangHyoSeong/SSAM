import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./InviteCode.module.scss";
import ClassProduceModal from "./ClassProduceModal";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";
const apiUrl = import.meta.env.API_URL;
import Swal from "sweetalert2";

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
          console.error("데이터를 가져오지 못했습니다:", error);
        }
      };
      fetchData();
    }, []);

    return profileData;
  };

  const profile = useProfile();

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const token = localStorage.getItem("USER_TOKEN");
        const { boardId } = await fetchApiUserInitial();
        const response = await axios.get(`${apiUrl}/v1/classrooms/${boardId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        setClassInfo(response.data);
      } catch (error) {
        console.error("클래스 정보를 가져오지 못했습니다:", error);
      }
    };
    fetchClassInfo();
  }, []);

  const updateClassInfo = async () => {
    const { boardId } = await fetchApiUserInitial();
    const token = localStorage.getItem("USER_TOKEN");
    const response = await axios.get(`${apiUrl}/v1/classrooms/${boardId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    setClassInfo(response.data);
  };

  const classDelete = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      await axios.delete(`${apiUrl}/v1/classrooms/teachers/${boardId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      Swal.fire({
        title: "삭제됨!",
        text: "학급이 삭제되었습니다.",
        icon: "success",
      });
      updateClassInfo(); // Update class info after deletion
    }
  };

  const rePin = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    await axios.put(`${apiUrl}/v1/classrooms/teachers/pin/${boardId}`, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    Swal.fire("PIN이 재발급되었습니다").then((isConfirm) => {
      if (isConfirm) {
        updateClassInfo(); // Update class info after re-issuing the pin
      }
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className={styles.inviteArray}>
      <div className={styles.inviteCodeBox}>
        <h1>{profile.name}님 환영합니다</h1>
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
            <div>
              <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
              <button className={styles.classBtn} onClick={toggleModal}>
                학급 생성
              </button>
            </div>
          )}
        </div>
        {isModalOpen && <ClassProduceModal onClassCreated={updateClassInfo} />}
      </div>
    </div>
  );
};

export default InviteCode;
