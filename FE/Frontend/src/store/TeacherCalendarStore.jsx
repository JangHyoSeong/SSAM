import create from "zustand";

const useTeacherCalendarStore = create((set, get) => ({
  consultations: [
    { time: "14:00 ~ 14:20", available: true },
    { time: "14:30 ~ 14:50", available: true },
    { time: "15:00 ~ 15:20", available: true },
    { time: "15:30 ~ 15:50", available: true },
    { time: "16:00 ~ 16:20", available: false },
    { time: "16:30 ~ 16:50", available: true },
    { time: "17:00 ~ 17:20", available: false },
  ],
  setConsultations: (consultations) => set({ consultations }),
  toggleAvailability: (index) =>
    set((state) => {
      const updatedConsultations = state.consultations.map((consultation, i) =>
        i === index
          ? { ...consultation, available: !consultation.available }
          : consultation
      );
      return { consultations: updatedConsultations };
    }),
  getAvailableCount: () => {
    return get().consultations.filter((consultation) => consultation.available)
      .length;
  },
}));

export default useTeacherCalendarStore;
