// hooks/useProfile.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.API_URL;

export const useProfile = () => {
  const [profileData, setProfileData] = useState({ name: "" });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("USER_TOKEN");
      try {
        console.log("Fetching profile data with token:", token);
        const response = await axios.get(`${apiUrl}/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        const data = {
          name: response.data.name || "",
        };
        setProfileData(data);
        console.log("가져온 프로필 데이터 : ", data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    fetchData();
  }, []);

  return { profileData };
};
