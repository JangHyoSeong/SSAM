import { useState } from 'react';
import Footer from '../../mainPage/Footer';
import styles from './TeacherQuestion.module.css';
import AnswerModal from './AnswerModal';
import TeacherDeleteModal from './TeacherDeleteModal';
import { FaTrash, FaEdit } from 'react-icons/fa';

const TeacherQuestion = () => {
  const initialQuestions = [
    { id: 1, question: "점심 메뉴는 어디서 확인하나요?", answer: "", answerText: "" },
    { id: 2, question: "교무실 전화번호는 무엇인가요?", answer: "", answerText: "" },
    { id: 3, question: "교장실 전화번호는 무엇인가요?", answer: "", answerText: "" },
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToAnswer, setQuestionToAnswer] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const handleEditClick = (id) => {
    setSelectedAnswerId(id);
    setQuestionToAnswer(questions.find(question => question.id === id));
    setIsAnswerModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(id);
  };

  const handleAnswerModalConfirm = (answer) => {
    setQuestions(questions.map(question =>
      question.id === selectedAnswerId ? { ...question, answer: answer } : question
    ));
    setIsAnswerModalOpen(false);
    setSelectedAnswerId(null);
    setQuestionToAnswer(null);
  };

  const handleAnswerModalCancel = () => {
    setIsAnswerModalOpen(false);
    setSelectedAnswerId(null);
    setQuestionToAnswer(null);
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

  return (
    <>
    <div className={styles.teacherQuestionContainer}>
      {questions.map((item) => (
        <div key={item.id} className={styles.qaPair}>
          <div className={styles.boxContainer}>
            <div className={styles.questionBox}>
              <p>{item.question}</p>
              <FaTrash className={styles.icon} onClick={() => handleDeleteClick(item.id)} />
            </div>
            <div className={`${styles.answerBox} ${selectedAnswerId === item.id ? styles.selected : ''}`}>
              <div>
                <p>{item.answer ? item.answer : 'A.'}</p>
              </div>
              <FaEdit className={styles.icon} onClick={() => handleEditClick(item.id)} />
            </div>
          </div>
        </div>
      ))}
      {isAnswerModalOpen && (
        <AnswerModal 
          question={questionToAnswer?.question} 
          onConfirm={handleAnswerModalConfirm} 
          onCancel={handleAnswerModalCancel}
        />
      )}
      {isDeleteModalOpen && (
        <TeacherDeleteModal 
          onConfirm={handleDeleteModalConfirm} 
          onCancel={handleDeleteModalCancel}
        />
      )}
    </div>
    <Footer />
    </>
  );
};

export default TeacherQuestion;
