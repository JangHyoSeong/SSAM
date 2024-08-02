import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";

const useLoginStore = create((set) => ({
  username: "",
  password: "",
  isLoggedIn: false,
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  handleChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      ...state,
      // 구조 분해 할당 (동적 키 처리)
      [name]: value,
    }));
  },
}));

export { useLoginStore };

const useAuthStore = create((set) => ({
  username: "",
  password: "",
  email: "",
  school: "",
  name: "",
  birthdate: "",
  phone: "",
  setFormData: (key, value) => set((state) => ({ ...state, [key]: value })),
  signup: async (formData) => {
    try {
      const response = await axiosInstance.post(
        "https://i11e201.p.ssafy.io/api/v1/auth/teachers",
        formData
      );
      if (response.status === 200) {
        alert("Registration successful!");
      } else {
        console.error("Error details:");
        alert("Registration failed!");
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(
        `Registration failed: ${error.response?.data?.message || error.message}`
      );
    }
  },
}));

export default useAuthStore;
