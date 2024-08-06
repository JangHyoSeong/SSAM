// 백이랑 연결하면 사용할 스토어
import { create } from "zustand";

const useConsultationStore = create((set) => ({
  reservationData: null,
  setReservationData: (data) => set({ reservationData: data }),
}));

export default useConsultationStore;
