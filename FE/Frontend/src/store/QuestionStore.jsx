import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchQuestionData } from "../apis/stub/28-31 문의사항/apiStubQuestion";
import { fetchApiUserInitial } from "../apis/stub/20-22 사용자정보/apiStubUserInitial";

const QuestionStore = createContext();

export const useQuestions = () => useContext(QuestionStore);

export const QuestionProvider = ({ children }) => {
  // Context를 통해 넘겨주기 위해 상태관리해야함
  const [questions, setQuestions] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const token = localStorage.getItem("USER_TOKEN");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { boardId } = await fetchApiUserInitial();
        if (!boardId) {
          throw new Error("Failed to get boardId from fetchApiUserInitial");
        }
        setBoardId(boardId);
        // setUsername(name);
        const data = await fetchQuestionData(boardId);
        setQuestions(Array.isArray(data) ? data : [data]); // 응답이 배열인지 확인
        // console.log("QuestionProvider", boardId);
      } catch (error) {
        console.error("Failed to fetch initial question data:", error);
      }
    };

    fetchData();
  }, [token]); // token을 종속성 배열에 추가

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
      value={{
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        boardId,
        name,
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
