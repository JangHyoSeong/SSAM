// GET, POST, DELETE, PUT
// 질문 api: /classrooms/questions/{board_id}
// 질문 api: /classrooms/questions/{board_id}
// 질문 api: /classrooms/questions/{qustion_id}
// 대답 api: /classrooms/answers/{qustion_id}

import { create } from "zustand";
import axios from "axios";

const defaultQuestion = {
  board_id: "",
  question_id: "",
  student_id: "",
  answer_date: "",
  content_date: "",
  content: "",
  answer: "",
};

const useQuestionStore = create((set) => ({
  question: { ...defaultQuestion },

  init: () => {
    set({ question: { ...defaultQuestion } });
  },

  fetchQuestionData: async (board_id) => {
    try {
      const token = localStorage.getItem("USER_TOKEN");
      console.log(token);
      const response = await axios.get(
        `http://localhost:8081/v1/classrooms/questions/${board_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );
      set({ question: response.data });
      // response.data에 있는 내용 쓰시면 됩니다.
      console.log("question.jsx: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch question data:", error);
      throw error;
    }
  },
}));

export default useQuestionStore;
