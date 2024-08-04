import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { useQuestions } from "../../../store/QuestionContext";
import TeacherDeleteModal from "./TeacherDeleteModal";
import styles from "./TeacherQuestion.module.scss";
import useQuestionStore from "../../../apis/stub/28-31 문의사항/question";

// bordId인자로 받음
const TeacherQuestion = () => {
  const { boardId } = useParams(); // URL에서 boardId 추출
  const { question, init, fetchQuestionData } = useQuestionStore();
  const [error, setError] = useState("");
  console.log("TeacherQuestion inside ", boardId);

  useEffect(() => {
    init();
    const fetchData = async () => {
      console.log("boardId inside useEffect:", boardId);
      try {
        await fetchQuestionData(boardId);
      } catch (err) {
        setError("질문 데이터를 가져오는 데 실패했습니다.");
      }
    };
    if (boardId) {
      fetchData();
    } else {
      console.error("boardId is not defined");
    }
  }, [init, fetchQuestionData, boardId]);
  //

  const { questions, updateQuestion, deleteQuestion } = useQuestions();
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");

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

  const trimDate = (dateString) => {
    const parts = dateString.split(".");
    if (parts.length < 3) return dateString; // 날짜 형식이 맞지 않는 경우 원본 문자열 반환
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
  };

  return (
    <div className={styles.teacherQuestionContainer}>
      {/* 추가부분 */}
      {error && <div className={styles.error}>{error}</div>}
      <p className={styles.question}>{question.content}</p>
      {/* 여기까지 */}
      {questions.map((item) => (
        <div key={item.id} className={styles.qaPair}>
          <div className={styles.boxContainer}>
            <div className={styles.questionBox}>
              <div className={styles.authorAndDate}>
                <p className={styles.author}>{item.author}</p>
                <p className={styles.date}>{trimDate(item.date)}</p>
              </div>
              <p className={styles.question}>{item.question}</p>
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
                    <p className={styles.date}>{trimDate(item.date)}</p>
                  </div>
                  <p className={styles.answer}>
                    {item.answer ? item.answer : "A."}
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
