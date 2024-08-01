import PropTypes from "prop-types";
import styles from "./ConsultationItem.module.scss";

const ConsultationItem = ({ date, time, studentName, subject, content }) => {
  return (
    <div>
      <article className={styles.consultationRow}>
        <section className={styles.array}>
          <div>{date}</div>
          <div>{time}</div>
          <div>{studentName}</div>
          <div>{subject}</div>
        </section>
        <section className={styles.array}>
          <div>{content}</div>
          <button className={styles.approveButton}>승인</button>
          <button className={styles.editButton}>거절</button>
        </section>
      </article>
    </div>
  );
};

ConsultationItem.propTypes = {
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  studentName: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default ConsultationItem;
