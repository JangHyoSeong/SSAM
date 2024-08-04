// GET, POST
// api: /users
// 연결페이지: teacher/mypage/TeacherUpdate.jsx

import { create } from "zustand";
import axios from "axios";

const defaultProfile = {
  userId: "",
  username: "",
  password: "",
  schoolId: "",
  role: "",
  name: "",
  email: "",
  phone: "",
  birth: "",
  imgUrl: "",
  otherName: "",
  otherRelation: "",
  otherPhone: "",
};

const useProfileStore = create((set) => ({
  profile: { ...defaultProfile },

  init: () => {
    set({ profile: { ...defaultProfile } });
  },

  fetchProfileData: async () => {
    const response = await axios.get(`/profile`, {
      headers: { "Content-Type": "application/json" },
    });
    set({ profile: response.data });
    return response.data;
  },
  updateProfile: async (profileData) => {
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });

      const response = await axios.put(`/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ profile: response.data });
      return response.data;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },
}));

export default useProfileStore;
