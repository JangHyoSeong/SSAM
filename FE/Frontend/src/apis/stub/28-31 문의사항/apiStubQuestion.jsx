import axios from "axios";
import { fetchApiUserInitial } from "../20-22 사용자정보/apiStubUserInitial";

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
// POST -대답 api: /classrooms/answers/{qustion_id}
// export const useApiTeachrClassroomsAnswers = create((set) => ({
//   question: { ...defaultQuestion },

//   init: () => {
//     set({ question: { ...defaultQuestion } });
//   },

//   fetchQuestionData: async (question_id) => {
//     try {
//       const token = localStorage.getItem("USER_TOKEN");
//       console.log(token);
//       const response = await axios.put(`classrooms/answers/${question_id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           authorization: `${token}`,
//         },
//       });
//       set({ question: response.data });
//       // response.data에 있는 내용 쓰시면 됩니다.
//       console.log("question.jsx: ", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch question data:", error);
//       throw error;
//     }
//   },
// }));
