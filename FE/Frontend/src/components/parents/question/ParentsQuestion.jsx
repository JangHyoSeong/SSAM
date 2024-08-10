import { useState } from "react";
import { FaTrash, FaPen, FaPlus, FaMinus } from "react-icons/fa";
import { useQuestions } from "../../../store/QuestionStore";
import ParentsDeleteModal from "./ParentsDeleteModal";
import styles from "./ParentsQuestion.module.scss";

const ParentsQuestion = () => {
  const { questions, addQuestion, deleteQuestion } = useQuestions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInputOpen, setIsInputOpen] = useState(false); // 슬라이드 입력창 상태 추가

  console.log("ParentsQuestion", questions);

  const handleDeleteClick = (questionId) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(questionId);
  };

  const handleDeleteModalConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteQuestion(questionToDelete);
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    } catch (err) {
      console.error("Failed to delete question:", err);
      setError("질문 삭제에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setQuestionToDelete(null);
    setError(null);
  };

  const handleNewQuestionSubmit = async () => {
    if (newQuestion.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        await addQuestion(newQuestion);
        setIsInputOpen(false); // 슬라이드 입력창 닫기
        setNewQuestion("");
      } catch (err) {
        console.error("Failed to add question:", err);
        setError("질문 추가에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const sortedQuestions = [...questions].sort(
    (a, b) => b.questionId - a.questionId
  );

  return (
    <div className={styles.parentsQuestionContainer}>
      <div className={styles.header}>
        <h2>
          다른 사용자의 <span className={styles.highlight}>익명성</span>을
          유지하기 위해 귀하의 실명은{" "}
          <span className={styles.highlight}>교사</span>에게만 표시됩니다.
        </h2>
      </div>
      <div
        className={`${styles.inquireContainer} ${
          isInputOpen ? styles.open : ""
        }`}
      >
        <div
          className={styles.iconCircle}
          onClick={() => setIsInputOpen(!isInputOpen)}
        >
          {isInputOpen ? (
            <FaMinus className={styles.icon} />
          ) : (
            <FaPlus className={styles.icon} />
          )}
        </div>
        <div className={styles.slideContainer}>
          {isInputOpen && (
            <div className={styles.inputContainer}>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="질문을 입력하세요."
                disabled={isLoading}
              />
              <button onClick={handleNewQuestionSubmit} disabled={isLoading}>
                <FaPen className={styles.icon} />
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {sortedQuestions.map((item) => (
        <div key={item.questionId} className={styles.qaPair}>
          <div className={styles.questionBox}>
            <div className={styles.textAndDate}>
              <p>
                <strong>궁금이</strong> {item.content}
              </p>
              <p className={styles.date}>{formatDate(item.contentDate)}</p>
            </div>
            <FaTrash
              onClick={() => handleDeleteClick(item.questionId)}
              className={isLoading ? styles.disabledIcon : styles.trashicon}
            />
          </div>
          {item.answer && (
            <div className={styles.answerBox}>
              <div className={styles.textAndDate}>
                <p>
                  <strong>선생님</strong> {item.answer}
                </p>
                <p className={styles.date}>{formatDate(item.answerDate)}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {isDeleteModalOpen && (
        <ParentsDeleteModal
          onConfirm={handleDeleteModalConfirm}
          onCancel={handleDeleteModalCancel}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default ParentsQuestion;
