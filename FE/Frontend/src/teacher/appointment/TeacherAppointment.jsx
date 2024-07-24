import TeacherCalendar from "./TeacherCalendar";
import TeacherConsultationList from "./TeacherConsultationList";
import styles from "./TeacherAppointment.module.scss";

const TeacherAppointment = () => {
  return (
    <div className={styles.container}>
      <TeacherCalendar />
      <TeacherConsultationList />
    </div>
  );
};

export default TeacherAppointment;
