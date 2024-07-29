// src/store/AuthStore.js
import create from 'zustand';

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
      const response = await fetch('https://i11e201.p.ssafy.io/api/v1/auth/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      // Handle successful signup (e.g., set user state, redirect, etc.)
      console.log('Signup successful', data);
    } catch (error) {
      console.error(error.message);
      // Handle error (e.g., set error state, display error message, etc.)
    }
  },
}));

export default useAuthStore;
