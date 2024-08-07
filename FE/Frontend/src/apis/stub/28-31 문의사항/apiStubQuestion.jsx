import axios from "axios";
import { useState } from "react";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";
import { useQuestions } from "../../../store/QuestionStore";

// GET - 공통api: /classrooms/questions/{board_id}
export const fetchQuestionData = async () => {
  try {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    const response = await axios.get(
      `http://localhost:8081/v1/classrooms/questions/${boardId}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );
    console.log("axios-questions: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question data:", error);
    throw error;
  }
};

// POST - 학생 질문 생성 api: /classrooms/answers/{board_id}
// content 상태를 받아올 방법을 생각하자.
// const { addQuestion } = useQuestions();
export const fetchCreateQuestionData = async () => {
  try {
    const token = localStorage.getItem("USER_TOKEN");
    const { boardId } = await fetchApiUserInitial();
    const response = await axios.post(
      `http://localhost:8081/v1/classrooms/questions/${boardId}`,
      // { content },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );
    console.log("axios-questions: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch question data:", error);
    throw error;
  }
};
