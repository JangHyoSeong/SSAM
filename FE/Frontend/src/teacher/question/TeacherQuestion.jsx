//TeacherQuestion.jsx

import React, { useState } from 'react';
import styles from './TeacherQuestion.module.scss';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useQuestions } from '../../store/QuestionContext';
import TeacherDeleteModal from './TeacherDeleteModal';

const TeacherQuestion = () => {
  const { questions, updateQuestion, deleteQuestion } = useQuestions();
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const handleEditClick = (id) => {
    setSelectedAnswerId(id);
  };

  const handleDeleteClick = (id) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(id);
  };

  const handleDeleteModalConfirm = () => {
    deleteQuestion(questionToDelete);
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
  };

  const handleAnswerChange = (event, id) => {
    const updatedAnswer = event.target.value;
    updateQuestion(id, updatedAnswer);
  };

  const handleAnswerBlur = () => {
    setSelectedAnswerId(null);
  };

  return (
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
                {selectedAnswerId === item.id ? (
                  <textarea
                    className={styles.inputField}
                    value={item.answer}
                    onChange={(event) => handleAnswerChange(event, item.id)}
                    onBlur={handleAnswerBlur}
                  />
                ) : (
                  <p>{item.answer ? item.answer : 'A.'}</p>
                )}
              </div>
              <FaEdit className={styles.icon} onClick={() => handleEditClick(item.id)} />
            </div>
          </div>
        </div>
      ))}
      {isDeleteModalOpen && (
        <TeacherDeleteModal 
          onConfirm={handleDeleteModalConfirm} 
          onCancel={handleDeleteModalCancel}
        />
      )}
    </div>
  );
};

export default TeacherQuestion;
