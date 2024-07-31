import { useState } from 'react';
import styles from './AnswerModal.module.scss';

const AnswerModal = ({ question, onConfirm, onCancel }) => {
  const [answer, setAnswer] = useState('');

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    onConfirm(answer);
    setAnswer('');
  };

  return (
    <div className={styles.answerModalOverlay} onClick={onCancel}>
      <div className={styles.answerModalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Q. {question}</h2>
        <textarea 
          value={answer}
          onChange={handleChange}
          placeholder="답변을 입력하세요."
        />
        <div className={styles.answerModalButtons}>
          <button className={styles.submitButton} onClick={handleSubmit}>제출</button>
          <button className={styles.cancelButton} onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal;
