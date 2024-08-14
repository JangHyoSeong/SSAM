import { useState, useEffect } from 'react';
import axios from 'axios';

// 환경 변수에서 API URL을 가져옵니다.
const apiUrl = import.meta.env.API_URL;

// useProfile 커스텀 훅: 사용자 프로필 데이터를 가져오는 훅
export const useProfile = () => {
  // 프로필 데이터를 저장할 상태를 초기화합니다.
  const [profileData, setProfileData] = useState({ name: "" });

  // 컴포넌트가 마운트될 때 프로필 데이터를 가져옵니다.
  useEffect(() => {
    const fetchData = async () => {
      // 로컬 스토리지에서 사용자 토큰을 가져옵니다.
      const token = localStorage.getItem("USER_TOKEN");
      try {
        console.log("Fetching profile data with token:", token);
        // API에 GET 요청을 보내 프로필 데이터를 가져옵니다.
        const response = await axios.get(`${apiUrl}/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        // 응답에서 필요한 데이터를 추출합니다.
        const data = {
          name: response.data.name || "",
        };
        // 프로필 데이터 상태를 업데이트합니다.
        setProfileData(data);
        console.log("가져온 프로필 데이터 : ", data);
      } catch (error) {
        // 에러 발생 시 콘솔에 에러를 출력합니다.
        console.error("Failed to fetch profile data:", error);
      }
    };
    // fetchData 함수를 실행합니다.
    fetchData();
  }, []); // 빈 의존성 배열: 컴포넌트가 마운트될 때만 실행

  // 프로필 데이터를 반환합니다.
  return { profileData };
};