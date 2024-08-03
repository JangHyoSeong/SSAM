// GET, POST, DELETE, PUT
// 질문 api: /classrooms/questions/{board_id}
// 질문 api: /classrooms/questions/{board_id}
// 질문 api: /classrooms/questions/{qustion_id}
// 대답 api: /classrooms/answers/{qustion_id}

import { create } from "zustand";
import axios from "axios";

const defaultQuestion = {
  board_id: "1",
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
      const token = localStorage.getItem("token");
      const response = await axios.get(`/questions/${board_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      set({ question: response.data });
      console.log("question.jsx: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch question data:", error);
      throw error;
    }
  },
  // updateProfile: async (qustioneData) => {
  //   try {
  //     const formData = new FormData();
  //     Object.keys(qustioneData).forEach((key) => {
  //       formData.append(key, qustioneData[key]);
  //     });

  //     const response = await axios.put(`/profile`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     set({ qustion: response.data });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Failed to update qustion:", error);
  //     throw error;
  //   }
  // },
}));

export default useQuestionStore;

// import { create } from "zustand";
// import axios from "axios";

// const defaultQuestion = {
//   board_id: "",
//   qustion_id: "",
//   student_id: "",
//   answer_date: "",
//   content_date: "",
//   content: "",
//   answer: "",
// };

// const useQuestionStore = create((set) => ({
//   qustion: { ...defaultQuestion },

//   init: () => {
//     set({ qustion: { ...defaultQuestion } });
//   },

//   fetchQuestionData: async (board_id) => {
//     try {
//       const response = await axios.get(`/classrooms/questions/${board_id}`, {
//         headers: { "Content-Type": "application/json" },
//       });
//       set({ question: response.data });
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch question data:", error);
//       throw error;
//     }
//   },
// }));

// export default useQuestionStore;
