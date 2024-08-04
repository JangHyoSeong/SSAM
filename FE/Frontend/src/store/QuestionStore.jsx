import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useApiBothClassroomsQuestions } from "../apis/stub/28-31 문의사항/question";

const QuestionStore = createContext();
export const useQuestions = () => useContext(QuestionStore);

export const QuestionProvider = ({ children }) => {
  const { question, fetchQuestionData } = useApiBothClassroomsQuestions();
  const [questions, setQuestions] = useState([]);
  // 더미 데이터 코드 지움

  // 추가된 코드
  // useEffect로 데이터를 fetch함. 이 코드로 axios요청을 받은 데이터를 가져와서 사용함.
  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        const data = await fetchQuestionData(1); // Replace with the appropriate board ID
        setQuestions([data]); // Assuming the response is a single question, wrap it in an array
      } catch (error) {
        console.error("Failed to fetch initial question data:", error);
      }
    };

    fetchData();
  }, [fetchQuestionData]);
  // 여기까지

  const addQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, updatedAnswer) => {
    setQuestions(
      questions.map((question) =>
        question.id === id
          ? {
              ...question,
              answer: updatedAnswer,
              date: new Date().toLocaleString(),
            }
          : question
      )
    );
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  return (
    <QuestionStore.Provider
      value={{ questions, addQuestion, updateQuestion, deleteQuestion }}
    >
      {children}
    </QuestionStore.Provider>
  );
};

QuestionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QuestionProvider;

// 백업 코드
// import { createContext, useState, useContext } from "react";
// import PropTypes from "prop-types";
// import "../apis/stub/28-31 문의사항/question";

// const QuestionStore = createContext();
// export const useQuestions = () => useContext(QuestionStore);

// export const QuestionProvider = ({ children }) => {
//   const [questions, setQuestions] = useState([
//     {
//       id: 1,
//       question: "점심 메뉴는 어디서 확인하나요?",
//       answer: "",
//       author: "학부모",
//       date: "24.07.17 10:16",
//     },
//     {
//       id: 2,
//       question: "교무실 전화번호는 무엇인가요?",
//       answer: "",
//       author: "학부모",
//       date: "24.07.17 10:16",
//     },
//   ]);

//   const addQuestion = (newQuestion) => {
//     setQuestions([...questions, newQuestion]);
//   };

//   const updateQuestion = (id, updatedAnswer) => {
//     setQuestions(
//       questions.map((question) =>
//         question.id === id
//           ? {
//               ...question,
//               answer: updatedAnswer,
//               date: new Date().toLocaleString(),
//             }
//           : question
//       )
//     );
//   };

//   const deleteQuestion = (id) => {
//     setQuestions(questions.filter((question) => question.id !== id));
//   };

//   return (
//     <QuestionStore.Provider
//       value={{ questions, addQuestion, updateQuestion, deleteQuestion }}
//     >
//       {children}
//     </QuestionStore.Provider>
//   );
// };

// QuestionProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default QuestionProvider;
