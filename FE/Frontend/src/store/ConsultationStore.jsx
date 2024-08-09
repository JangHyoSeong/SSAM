import { createContext, useState, useContext, useEffect } from "react";
import {
  fetchApiReservationList,
  updateAppointmentStatus,
} from "../apis/stub/55-59 상담/apiStubReservation";

const ConsultationContext = createContext();

export const useConsultation = () => useContext(ConsultationContext);

export const ConsultationProvider = ({ children }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  // 목록
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await fetchApiReservationList();
      setConsultations(data);
      setError(null);
    } catch (err) {
      setError("상담 목록을 불러오는데 실패했습니다.");
      console.error("Failed to fetch consultations:", err);
    } finally {
      setLoading(false);
    }
  };

  // 승인
  const approveConsultation = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId);
      setConsultations(
        consultations.map((c) =>
          c.appointmentId === appointmentId ? { ...c, status: "BEFORE" } : c
        )
      );
    } catch (err) {
      console.error("Failed to approve consultation:", err);
      setError("상담 승인에 실패했습니다.");
    }
  };

  // 거절
  const rejectConsultation = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId);
      setConsultations(
        consultations.map((c) =>
          c.appointmentId === appointmentId ? { ...c, status: "CANCEL" } : c
        )
      );
    } catch (err) {
      console.error("Failed to reject consultation:", err);
      setError("상담 거절에 실패했습니다.");
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        loading,
        error,
        approveConsultation,
        rejectConsultation,
        refreshConsultations: fetchConsultations,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
