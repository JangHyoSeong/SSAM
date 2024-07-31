// 백이랑 연결하면 사용할 스토어
import { create } from "zustand";

const useConsultationStore = create((set) => ({
  consultations: [],
  fetchConsultations: async () => {
    const response = await fetch("/path/to/your/data.json"); // Replace with your actual data path
    const data = await response.json();
    set({ consultations: data });
  },
}));

export default useConsultationStore;
