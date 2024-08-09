import { create } from "zustand";
import axios from "axios";
import { fetchApiUserInitial } from "../apis/stub/20-22 사용자정보/apiStubUserInitial";

const apiUrl = import.meta.env.API_URL;

export const AppointmentStatus = {
  APPLY: "APPLY",
  ACCEPTED: "ACCEPTED",
  DONE: "DONE",
  CANCEL: "CANCEL",
  REJECT: "REJECT",
};

const useTeacherCalendarStore = create((set, get) => ({
  consultations: [
    { time: "14:00 ~ 14:20", status: null },
    { time: "14:30 ~ 14:50", status: null },
    { time: "15:00 ~ 15:20", status: null },
    { time: "15:30 ~ 15:50", status: null },
    { time: "16:00 ~ 16:20", status: null },
    { time: "16:30 ~ 16:50", status: null },
    { time: "17:00 ~ 17:20", status: null },
  ],
  setConsultations: (consultations) => set({ consultations }),
  isAvailable: (status) =>
    status === null || status === AppointmentStatus.CANCEL,
  getAvailableCount: () => {
    return get().consultations.filter((consultation) =>
      get().isAvailable(consultation.status)
    ).length;
  },
  fetchReservations: async () => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      const { userId } = await fetchApiUserInitial();
      const response = await axios.get(`${apiUrl}/v1/consults/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      set((state) => {
        const updatedConsultations = state.consultations.map((consultation) => {
          const [startTime, endTime] = consultation.time.split(" ~ ");
          const matchingReservation = response.data.find(
            (reservation) =>
              reservation.start_time.includes(startTime) &&
              reservation.end_time.includes(endTime)
          );

          return {
            ...consultation,
            status: matchingReservation ? matchingReservation.status : null,
          };
        });

        return { consultations: updatedConsultations };
      });
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  },
}));

export default useTeacherCalendarStore;
