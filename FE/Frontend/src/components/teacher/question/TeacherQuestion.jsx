import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { useQuestions } from "../../../store/QuestionStore";
import TeacherDeleteModal from "./TeacherDeleteModal";
import styles from "./TeacherQuestion.module.scss";

const TeacherQuestion = () => {
  const { questions, updateQuestion, deleteQuestion, boardId } = useQuestions();
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  // QuestionProvider 안에 fetchApiUserInitial에서 받아온 데이터 있는듯? name, boardId

  // boardId
  // const { boardId, name } = fetchApiUserInitial();
  console.log("boardId inside ", boardId);
  // console.log("name inside ", name);

  // 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) {
      console.error("컴포넌트 : No token found, redirecting to login...");
      return;
    }
  }, []);

  const handleEditClick = (id, currentAnswer) => {
    setEditingAnswerId(id);
    setNewAnswer(currentAnswer);
  };

  const handleSaveClick = (id) => {
    updateQuestion(id, newAnswer);
    setEditingAnswerId(null);
    setNewAnswer("");
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

  // const trimDate = (dateString) => {
  //   const parts = dateString.split(".");
  //   if (parts.length < 3) return dateString; // 날짜 형식이 맞지 않는 경우 원본 문자열 반환
  //   return `${parts[0]}.${parts[1]}.${parts[2]}`;
  // };

  return (
    <div className={styles.teacherQuestionContainer}>
      {questions.map((item) => (
        <div key={item.id} className={styles.qaPair}>
          <div className={styles.boxContainer}>
            <div className={styles.questionBox}>
              <div className={styles.authorAndDate}>
                <p className={styles.author}>{item.studentId}</p>
                {/* <p className={styles.date}>{trimDate(item.date)}</p> */}
              </div>
              <p className={styles.question}>{item.content}</p>
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
                <>
                  <div className={styles.authorAndDate}>
                    <p className={styles.author}>선생님</p>
                    {/* <p className={styles.date}>{trimDate(item.date)}</p> */}
                  </div>
                  <p className={styles.answer}>
                    {item.answer
                      ? item.answer
                      : "답변이 없어요... 선생님이 답변을 입력해 주세요..."}
                  </p>
                </>
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
  );
};

export default TeacherQuestion;
