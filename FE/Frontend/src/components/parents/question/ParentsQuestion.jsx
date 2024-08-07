import { useState } from "react";
import { FaTrash, FaPen } from "react-icons/fa";
import { useQuestions } from "../../../store/QuestionStore";
import QuestionModal from "./QuestionModal";
import ParentsDeleteModal from "./ParentsDeleteModal";
import styles from "./ParentsQuestion.module.scss";

const ParentsQuestion = () => {
  const { questions, addQuestion, deleteQuestion } = useQuestions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState(""); // 새로운 질문 상태
  const [questionToDelete, setQuestionToDelete] = useState(null);
  console.log("ParentsQuestion", questions);

  const handleDeleteClick = (questionId) => {
    setIsDeleteModalOpen(true);
    setQuestionToDelete(questionId);
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

  const handleNewQuestionSubmit = () => {
    console.log("qustions.questionId", questions.questionId);
    addQuestion({
      questionId: questions.questionId + 1, // 임시 ID, 실제로는 고유 ID를 사용해야 합니다.
      content: newQuestion, // 이 부분을 수정합니다.
      answer: "",
      author: "학부모",
      contentDate: new Date().toISOString(), // contentDate 필드를 사용합니다.
      answerDate: "", // 초기값을 빈 문자열로 설정합니다.
    });
    setIsModalOpen(false);
    setNewQuestion(""); // 질문 제출 후 입력 필드 초기화
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // 'T'를 기준으로 문자열을 나누고 첫 번째 부분을 반환
  };

  return (
    <div className={styles.parentsQuestionContainer}>
      <div className={styles.header}>
        <h2>
          다른 사용자의 <span className={styles.highlight}>익명성</span>을
          유지하기 위해 귀하의 실명은{" "}
          <span className={styles.highlight}>교사</span>에게만 표시됩니다.
        </h2>
        <button
          className={styles.inquireButton}
          onClick={() => setIsModalOpen(true)}
        >
          <strong>문의하기</strong>
          <div className={styles.iconCircle}>
            <FaPen className={styles.icon} />
          </div>
        </button>
      </div>
      {questions.map((item) => (
        <div key={item.qustionId} className={styles.qaPair}>
          {" "}
          {/* 고유한 key prop 추가 */}
          <div className={styles.questionBox}>
            <div className={styles.textAndDate}>
              <p>
                <strong>궁금이</strong> {item.content}{" "}
                {/* content 필드를 사용합니다 */}
              </p>
              <p className={styles.date}>{formatDate(item.contentDate)}</p>
            </div>
            <FaTrash onClick={() => handleDeleteClick(item.qustionId)} />
          </div>
          {item.answer && (
            <div key={item.qustionId} className={styles.answerBox}>
              {" "}
              {/* 고유한 key prop 추가 */}
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
          key={questionToDelete} // key prop 추가
          onConfirm={handleDeleteModalConfirm}
          onCancel={handleDeleteModalCancel}
        />
      )}
    </div>
  );
};

export default ParentsQuestion;
