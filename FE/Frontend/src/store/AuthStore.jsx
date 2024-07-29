// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../axiosConfig';

const useAuthStore = create(
  persist(
    (set) => ({
      username: '',
      password: '',
      email: '',
      school: '',
      name: '',
      birthdate: '',
      phone: '',
      isAuthenticated: false,
      login: async (formData) => {
        try {
          const response = await axios.post('/login', formData);
          console.log('로그인 응답:', response);
          set({ isAuthenticated: true, ...formData });
          alert('로그인이 완료되었습니다.');
          // window.location.href = '/main';
        } catch (error) {
          console.error('로그인 오류:', error);
          alert(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        }
      },
      signup: async (formData) => {
        try {
          const response = await axios.post('/signup', formData);
          console.log('회원가입 응답:', response);
          alert('회원가입이 완료되었습니다.');
          // window.location.href = '/login';
        } catch (error) {
          console.error('회원가입 오류:', error);
          alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        }
      },
      logout: () =>
        set({
          isAuthenticated: false,
          username: '',
          password: '',
          email: '',
          school: '',
          name: '',
          birthdate: '',
          phone: '',
        }),
      setFormData: (name, value) => set((state) => ({ ...state, [name]: value })),
    }),
    { name: 'auth-storage' } // localStorage에 저장되는 키 이름 설정
  )
);

export default useAuthStore;
