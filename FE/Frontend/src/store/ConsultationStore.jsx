import { createContext, useState, useContext, useEffect } from "react";
import {
  fetchApiReservationList,
  fetchApiCancelReservation,
  fetchApiApproveReservation,
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
      console.error("Failed to fetch consultations:", err);
      setError("상담 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 승인
  const approveConsultation = async (appointmentId) => {
    try {
      await fetchApiApproveReservation(appointmentId);
      setConsultations(
        consultations.map((c) =>
          c.appointmentId === appointmentId ? { ...c, status: "ACCEPTED" } : c
        )
      );
    } catch (err) {
      console.error("Failed to approve consultation:", err);
      setError("상담 승인에 실패했습니다.");
    }
  };

  // 취소
  const cancelConsultation = async (appointmentId) => {
    try {
      await fetchApiCancelReservation(appointmentId);
      setConsultations(
        consultations.map((c) =>
          c.appointmentId === appointmentId ? { ...c, status: "CANCEL" } : c
        )
      );
    } catch (err) {
      console.error("Failed to cancel consultation:", err);
      setError("상담 취소에 실패했습니다.");
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        loading,
        error,
        approveConsultation,
        cancelConsultation,
        refreshConsultations: fetchConsultations,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
