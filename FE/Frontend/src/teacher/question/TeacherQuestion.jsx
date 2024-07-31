import { useState } from "react";
import styles from "./TeacherQuestion.module.scss";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import Footer from "../../mainPage/Footer";

const TeacherQuestion = () => {
  const initialQuestions = [
    {
      id: 1,
      question: "점심 메뉴는 어디서 확인하나요?",
      answer: "",
      answerText: "",
    },
    {
      id: 2,
      question: "교무실 전화번호는 무엇인가요?",
      answer: "",
      answerText: "",
    },
    {
      id: 3,
      question: "교장실 전화번호는 무엇인가요?",
      answer: "",
      answerText: "",
    },
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");

  const handleEditClick = (id, currentAnswer) => {
    setEditingAnswerId(id);
    setNewAnswer(currentAnswer);
  };

  const handleSaveClick = (id) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, answer: newAnswer } : question
      )
    );
    setEditingAnswerId(null);
    setNewAnswer("");
  };

  const handleDeleteClick = (id) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(id);
  };

  const handleDeleteModalConfirm = () => {
    setQuestions(
      questions.filter((question) => question.id !== questionToDelete)
    );
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
                <FaTrash
                  className={styles.icon}
                  onClick={() => handleDeleteClick(item.id)}
                />
              </div>
              <div className={`${styles.answerBox}`}>
                {editingAnswerId === item.id ? (
                  <input
                    type="text"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className={styles.inputField}
                    placeholder="답변을 입력하세요"
                  />
                ) : (
                  <p>{item.answer ? item.answer : "A."}</p>
                )}
                {editingAnswerId === item.id ? (
                  <FaSave
                    className={styles.icon}
                    onClick={() => handleSaveClick(item.id)}
                  />
                ) : (
                  <FaEdit
                    className={styles.icon}
                    onClick={() => handleEditClick(item.id, item.answer)}
                  />
                )}
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
      <Footer />
    </>
  );
};

export default TeacherQuestion;
