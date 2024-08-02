import React, { createContext, useState, useContext } from 'react';

const QuestionContext = createContext();

export const useQuestions = () => useContext(QuestionContext);

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([
    { id: 1, question: "점심 메뉴는 어디서 확인하나요?", answer: "", author: "학부모", date: "24.07.17 10:16" },
    { id: 2, question: "교무실 전화번호는 무엇인가요?", answer: "", author: "학부모", date: "24.07.17 10:16" },
  ]);

  const addQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, updatedAnswer) => {
    setQuestions(questions.map(question =>
      question.id === id ? { ...question, answer: updatedAnswer, date: new Date().toLocaleString() } : question
    ));
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(question => question.id !== id));
  };

  return (
    <QuestionContext.Provider value={{ questions, addQuestion, updateQuestion, deleteQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
};
