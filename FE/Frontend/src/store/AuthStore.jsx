// src/store/AuthStore.jsx
import { create } from 'zustand';
import axiosInstance from '../axiosConfig';

const useAuthStore = create((set) => ({
  username: '',
  password: '',
  email: '',
  school: '',
  name: '',
  birthdate: '',
  phone: '',
  setFormData: (key, value) => set((state) => ({ ...state, [key]: value })),
  signup: async (formData) => {
    try {
      const response = await axiosInstance.post('https://i11e201.p.ssafy.io/api/v1/auth/teachers', formData);
      if (response.status === 200) {
        alert('Registration successful!');
      } else {
        console.error('Error details:');
        alert('Registration failed!');
      }
    } catch (error) {
      console.error('Error details:', error);
      alert(`Registration failed: ${error.response?.data?.message || error.message}`);
    }
  },
}));

export default useAuthStore;
