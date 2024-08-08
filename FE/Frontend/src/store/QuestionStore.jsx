import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import {
  fetchQuestionData,
  fetchCreateQuestionData,
  fetchUpdateQuestionData,
} from "../apis/stub/28-31 문의사항/apiStubQuestion";
import { fetchApiUserInitial } from "../apis/stub/20-22 사용자정보/apiStubUserInitial";

const QuestionStore = createContext();

export const useQuestions = () => useContext(QuestionStore);

export const QuestionProvider = ({ children }) => {
  // Context를 통해 넘겨주기 위해 상태관리해야함
  const [questions, setQuestions] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const token = localStorage.getItem("USER_TOKEN");

  const fetchQuestions = async () => {
    try {
      const { boardId } = await fetchApiUserInitial();
      if (!boardId) {
        throw new Error("Failed to get boardId from fetchApiUserInitial");
      }
      setBoardId(boardId);
      const data = await fetchQuestionData(boardId);
      setQuestions(Array.isArray(data) ? data : [data]); // 응답이 배열인지 확인
    } catch (error) {
      console.error("Failed to fetch question data:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [token]); // token을 종속성 배열에 추가

  const addQuestion = async (newContent) => {
    try {
      const newQuestion = await fetchCreateQuestionData(newContent);
      setQuestions([...questions, newQuestion]);
    } catch (error) {
      console.error("Failed to create question:", error);
    }
  };

  const updateQuestion = async (questionId, updatedAnswer) => {
    try {
      const updatedQuestion = await fetchUpdateQuestionData(
        questionId,
        updatedAnswer
      );
      // 로컬 상태 업데이트
      setQuestions(
        questions.map((question) =>
          question.questionId === questionId ? updatedQuestion : question
        )
      );
      // 서버에서 최신 데이터 다시 가져오기
      await fetchQuestions();
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  return (
    <QuestionStore.Provider
      value={{
        questions,
        boardId,
        addQuestion,
        updateQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </QuestionStore.Provider>
  );
};

QuestionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QuestionProvider;

// 백업코드
// import { createContext, useState, useContext, useEffect } from "react";
// import PropTypes from "prop-types";
// import {
//   fetchQuestionData,
//   fetchCreateQuestionData,
//   fetchUpdateQuestionData,
// } from "../apis/stub/28-31 문의사항/apiStubQuestion";
// import { fetchApiUserInitial } from "../apis/stub/20-22 사용자정보/apiStubUserInitial";

// const QuestionStore = createContext();

// export const useQuestions = () => useContext(QuestionStore);

// export const QuestionProvider = ({ children }) => {
//   // Context를 통해 넘겨주기 위해 상태관리해야함
//   const [questions, setQuestions] = useState([]);
//   const [boardId, setBoardId] = useState(null);
//   const token = localStorage.getItem("USER_TOKEN");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { boardId } = await fetchApiUserInitial();
//         if (!boardId) {
//           throw new Error("Failed to get boardId from fetchApiUserInitial");
//         }
//         setBoardId(boardId);
//         const data = await fetchQuestionData(boardId);
//         setQuestions(Array.isArray(data) ? data : [data]); // 응답이 배열인지 확인
//       } catch (error) {
//         console.error("Failed to fetch initial question data:", error);
//       }
//     };

//     fetchData();
//   }, [token]); // token을 종속성 배열에 추가

//   const addQuestion = async (newContent) => {
//     try {
//       const newQuestion = await fetchCreateQuestionData(newContent);
//       setQuestions([...questions, newQuestion]);
//     } catch (error) {
//       console.error("Failed to create question:", error);
//     }
//   };

//   const updateQuestion = async (questionId, updatedAnswer) => {
//     try {
//       const updatedQuestion = await fetchUpdateQuestionData(
//         questionId,
//         updatedAnswer
//       );
//       console.log("updatedQuestion", updatedQuestion);
//       setQuestions(
//         questions.map((question) =>
//           question.id === questionId ? updatedQuestion : question
//         )
//       );
//     } catch (error) {
//       console.error("Failed to update question:", error);
//     }
//   };

//   const deleteQuestion = (id) => {
//     setQuestions(questions.filter((question) => question.id !== id));
//   };

//   return (
//     <QuestionStore.Provider
//       value={{
//         questions,
//         boardId,
//         addQuestion,
//         updateQuestion,
//         deleteQuestion,
//       }}
//     >
//       {children}
//     </QuestionStore.Provider>
//   );
// };

// QuestionProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default QuestionProvider;
