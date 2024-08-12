import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InviteCode.module.scss";
import ClassProduceModal from "./ClassProduceModal";
import { fetchApiUserInitial } from "../../../apis/stub/20-22 사용자정보/apiStubUserInitial";

const apiUrl = import.meta.env.API_URL; // API URL 가져오기
import Swal from "sweetalert2"; // 알림을 위한 SweetAlert2 라이브러리 임포트

const InviteCode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태를 관리
  const [classInfo, setClassInfo] = useState(null); // 클래스 정보 상태 관리
  const [isCopied, setIsCopied] = useState(false); // 복사 상태를 관리

  // 모달 토글 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const navigate = useNavigate(); // useNavigate 훅을 사용해 navigate 정의

  const handleConsultationStart = () => {
    navigate("/video/entry"); // 경로를 videoentry로 이동
  };

  // 사용자 프로필 정보를 불러오는 훅
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

  // 클래스 정보를 불러오는 효과
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

  // 클래스 정보 업데이트 함수
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

  // 클래스 삭제 함수
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
      try {
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
        setClassInfo(null);
      } catch (error) {
        console.error("학급 삭제 실패:", error);
        Swal.fire({
          title: "삭제 실패",
          text: "학급 삭제에 실패했습니다.",
          icon: "error",
        });
      }
    }
  };

  // PIN 코드 재발급 함수
  const rePin = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    await axios.put(
      `${apiUrl}/v1/classrooms/teachers/pin/${boardId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    Swal.fire("PIN이 재발급되었습니다").then((isConfirm) => {
      if (isConfirm) {
        updateClassInfo();
      }
    });
  };

  // 클립보드로 복사하는 함수
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  //   return (
  //     <div className={styles.inviteArray}>
  //       <div className={styles.inviteCodeBox}>
  //         <div className={styles.welcomeBox}>
  //           <h3>
  //             {profile.name} 님<br /> 환영합니다!
  //           </h3>
  //         </div>
  //         <div className={styles.btn}>
  //           {classInfo && classInfo.pin ? (
  //             <div>
  //               <div className={styles.copyButton}>
  //                 <h3>초대 코드 {classInfo.pin}</h3>
  //                 <button onClick={() => copyToClipboard(classInfo.pin)}>
  //                   {isCopied ? "복사 완료 ☑" : "코드 복사 ☐"}
  //                 </button>
  //               </div>
  //               <div className={styles.btnArray}>
  //                 <button className={styles.pinBtn} onClick={rePin}>
  //                   PIN 재발급
  //                 </button>
  //                 <button className={styles.deleteBtn} onClick={classDelete}>
  //                   학급 삭제
  //                 </button>
  //               </div>
  //             </div>
  //           ) : (
  //             <div>
  //               <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
  //               <button className={styles.classBtn} onClick={toggleModal}>
  //                 학급 생성
  //               </button>
  //             </div>
  //           )}
  //         </div>
  //         {isModalOpen && <ClassProduceModal onClassCreated={updateClassInfo} />}
  //       </div>
  //     </div>
  //   );
  // };
  return (
    <div className={styles.inviteArray}>
      {/* Welcome Section */}
      <div className={styles.welcomeBox}>
        <h3>
          {profile.name} 님<br /> 환영합니다!
        </h3>
      </div>

      {/* Invite Code Section */}
      <div className={styles.codeBox}>
        {classInfo && classInfo.pin ? (
          <>
            <div className={styles.copyButton}>
              <span>
                <h3>
                  초대 코드
                  <br /> {classInfo.pin}
                </h3>
              </span>
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
          </>
        ) : (
          <>
            <h3>학급 만들기를 통해 초대코드를 생성하세요.</h3>
            <button className={styles.classBtn} onClick={toggleModal}>
              학급 생성
            </button>
          </>
        )}
        {isModalOpen && <ClassProduceModal onClassCreated={updateClassInfo} />}
      </div>

      {/* Scheduled Consultation Section */}
      <div className={styles.codeBox}>
        <h3>
          예정된 상담이
          <br /> 있습니다.
        </h3>
        <button className={styles.classBtn} onClick={handleConsultationStart}>
          상담 시작하기
        </button>
      </div>
    </div>
  );
};

export default InviteCode;
