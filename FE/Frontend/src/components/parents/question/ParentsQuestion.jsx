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
  const [newQuestion, setNewQuestion] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setIsModalOpen(false);
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
          disabled={isLoading}
        >
          <strong>문의하기</strong>
          <div className={styles.iconCircle}>
            <FaPen className={styles.icon} />
          </div>
        </button>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {questions.map((item) => (
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
              className={isLoading ? styles.disabledIcon : styles.icon}
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

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
        onSubmit={handleNewQuestionSubmit}
        isLoading={isLoading}
      >
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="질문을 입력하세요."
          disabled={isLoading}
        />
      </QuestionModal>

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

// import { useState } from "react";
// import { FaTrash, FaPen } from "react-icons/fa";
// import { useQuestions } from "../../../store/QuestionStore";
// import QuestionModal from "./QuestionModal";
// import ParentsDeleteModal from "./ParentsDeleteModal";
// import styles from "./ParentsQuestion.module.scss";

// const ParentsQuestion = () => {
//   const { questions, addQuestion, deleteQuestion } = useQuestions();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [newQuestion, setNewQuestion] = useState(""); // 새로운 질문 상태
//   const [questionToDelete, setQuestionToDelete] = useState(null);
//   console.log("ParentsQuestion", questions);

//   const handleDeleteClick = (questionId) => {
//     setIsDeleteModalOpen(true);
//     setQuestionToDelete(questionId);
//   };

//   const handleDeleteModalConfirm = () => {
//     deleteQuestion(questionToDelete);
//     setIsDeleteModalOpen(false);
//     setQuestionToDelete(null);
//   };

//   const handleDeleteModalCancel = () => {
//     setIsDeleteModalOpen(false);
//     setQuestionToDelete(null);
//   };

//   const handleNewQuestionSubmit = () => {
//     if (newQuestion.trim()) {
//       addQuestion(newQuestion); // addQuestion 함수를 호출하여 새로운 질문 추가
//       setIsModalOpen(false);
//       setNewQuestion(""); // 질문 제출 후 입력 필드 초기화
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     return dateString.split("T")[0]; // 'T'를 기준으로 문자열을 나누고 첫 번째 부분을 반환
//   };

//   return (
//     <div className={styles.parentsQuestionContainer}>
//       <div className={styles.header}>
//         <h2>
//           다른 사용자의 <span className={styles.highlight}>익명성</span>을
//           유지하기 위해 귀하의 실명은{" "}
//           <span className={styles.highlight}>교사</span>에게만 표시됩니다.
//         </h2>
//         <button
//           className={styles.inquireButton}
//           onClick={() => setIsModalOpen(true)}
//         >
//           <strong>문의하기</strong>
//           <div className={styles.iconCircle}>
//             <FaPen className={styles.icon} />
//           </div>
//         </button>
//       </div>
//       {questions.map((item) => (
//         <div key={item.questionId} className={styles.qaPair}>
//           <div className={styles.questionBox}>
//             <div className={styles.textAndDate}>
//               <p>
//                 <strong>궁금이</strong> {item.content}
//               </p>
//               <p className={styles.date}>{formatDate(item.contentDate)}</p>
//             </div>
//             <FaTrash onClick={() => handleDeleteClick(item.questionId)} />
//           </div>
//           {item.answer && (
//             <div className={styles.answerBox}>
//               <div className={styles.textAndDate}>
//                 <p>
//                   <strong>선생님</strong> {item.answer}
//                 </p>
//                 <p className={styles.date}>{formatDate(item.answerDate)}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}

//       <QuestionModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleNewQuestionSubmit}
//       >
//         <textarea
//           value={newQuestion}
//           onChange={(e) => setNewQuestion(e.target.value)}
//           placeholder="질문을 입력하세요."
//         />
//       </QuestionModal>

//       {isDeleteModalOpen && (
//         <ParentsDeleteModal
//           onConfirm={handleDeleteModalConfirm}
//           onCancel={handleDeleteModalCancel}
//         />
//       )}
//     </div>
//   );
// };

// export default ParentsQuestion;
