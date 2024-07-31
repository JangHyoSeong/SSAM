import PropTypes from "prop-types";
import styles from "./ConsultationButton.module.scss";

const ConsultationButton = ({ consultation, index, clickedIndex, onClick }) => {
  const handleClick = () => {
    onClick(index);
  };

  const getButtonClasses = () => {
    if (!consultation.available) {
      return consultation.text === "신청취소"
        ? `${styles.unavailable} ${styles.reservationCancel}`
        : styles.unavailable;
    }
    return index === clickedIndex ? styles.clicked : styles.available;
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={handleClick}
      style={
        consultation.text === "신청취소"
          ? { backgroundColor: "#FF0000", color: "#FFFFFF" }
          : {}
      }
      disabled={!consultation.available}
    >
      {consultation.available ? consultation.text || "신청가능" : "신청불가"}
    </button>
  );
};

ConsultationButton.propTypes = {
  consultation: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  clickedIndex: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default ConsultationButton;
