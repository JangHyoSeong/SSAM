import { createContext, useState, useContext, useEffect } from "react";
import { fetchApiReservationList } from "../apis/stub/55-59 상담/apiStubReservation";

const ConsultationContext = createContext();

export const useConsultation = () => useContext(ConsultationContext);

export const ConsultationProvider = ({ children }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

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

  const approveConsultation = (appointmentId) => {
    // API 호출 및 상태 업데이트 로직 추가 필요
    setConsultations(
      consultations.map((c) =>
        c.appointmentId === appointmentId ? { ...c, status: "APPROVED" } : c
      )
    );
  };

  const rejectConsultation = (appointmentId) => {
    // API 호출 및 상태 업데이트 로직 추가 필요
    setConsultations(
      consultations.map((c) =>
        c.appointmentId === appointmentId ? { ...c, status: "REJECT" } : c
      )
    );
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
