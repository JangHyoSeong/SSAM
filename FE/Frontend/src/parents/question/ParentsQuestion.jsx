import React, { useState } from 'react';
import styles from './ParentsQuestion.module.css';
import { FaTrash, FaPen } from 'react-icons/fa';
import QuestionModal from './QuestionModal';
import ParentsDeleteModal from './ParentsDeleteModal';

const ParentsQuestion = () => {
  const initialQuestions = [
    { id: 1, question: "점심 메뉴는 어디서 확인하나요?", answer: "", author: "*****", date: "24.07.17 10:16" },
    { id: 2, question: "교무실 전화번호는 무엇인가요?", answer: "교무실 전화번호는 02-1234-5678 번 입니다.", author: "학부모", date: "24.07.17 10:16" },
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState(""); // 새로운 질문 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(id);
  };

  const handleDeleteModalConfirm = () => {
    setQuestions(questions.filter(question => question.id !== questionToDelete));
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const handleNewQuestionSubmit = () => {
    setQuestions([...questions, { id: questions.length + 1, question: newQuestion, answer: "", author: "학부모", date: new Date().toLocaleString() }]);
    setIsModalOpen(false);
    setNewQuestion(""); // 질문 제출 후 입력 필드 초기화
  };

  return (
    <div className={styles.parentsQuestionContainer}>
      <div className={styles.header}>
        <h2>
          다른 사용자의 <span className={styles.highlight}>익명성</span>을 유지하기 위해 귀하의 실명은 <span className={styles.highlight}>교사</span>에게만 표시됩니다.
        </h2>
        <button className={styles.inquireButton} onClick={() => setIsModalOpen(true)}>
          <strong>문의하기</strong>
          <div className={styles.iconCircle}>
            <FaPen className={styles.icon} />
          </div>
        </button>
      </div>
      {questions.map((item) => (
        <div key={item.id} className={styles.qaPair}>
          <div className={styles.questionBox}>
            <div className={styles.textAndDate}>
              <p><strong>{item.author}</strong> {item.question}</p>
              <p className={styles.date}>{item.date}</p>
            </div>
            <FaTrash className={styles.icon} onClick={() => handleDeleteClick(item.id)} />
          </div>
          {item.answer && (
            <div className={styles.answerBox}>
              <div className={styles.textAndDate}>
                <p><strong>선생님</strong> {item.answer}</p>
                <p className={styles.date}>{item.date}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewQuestionSubmit}
      >
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="질문을 입력하세요."
        />
      </QuestionModal>

      {isDeleteModalOpen && (
        <ParentsDeleteModal 
          onConfirm={handleDeleteModalConfirm} 
          onCancel={handleDeleteModalCancel}
        />
      )}
    </div>
  );
};

export default ParentsQuestion;
