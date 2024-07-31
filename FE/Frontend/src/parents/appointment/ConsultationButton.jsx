import PropTypes from "prop-types";
import styles from "./ConsultationButton.module.scss";

const ConsultationButton = ({ consultation, index, clickedIndex, onClick }) => {
  const handleClick = () => {
    onClick(index);
  };

  const getButtonClasses = () => {
    if (!consultation.available) {
      return consultation.text === "신청취소"
        ? `${styles.unavailable}`
        : styles.unavailable;
    }
    return index === clickedIndex ? styles.clicked : styles.available;
  };

  const buttonStyle =
    consultation.text === "신청취소"
      ? { backgroundColor: "#FF0000", color: "#FFFFFF", cursor: "pointer" }
      : {};

  let buttonText;
  if (consultation.available) {
    buttonText = "신청가능";
  } else {
    if (buttonStyle.color === "#FFFFFF") {
      buttonText = "신청취소";
    } else {
      buttonText = consultation.text || "신청불가";
    }
  }

  return (
    <button
      className={getButtonClasses()}
      onClick={handleClick}
      style={buttonStyle}
      disabled={!consultation.available}
    >
      {buttonText}
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
