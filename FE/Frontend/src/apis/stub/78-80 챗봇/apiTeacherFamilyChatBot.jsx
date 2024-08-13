import axios from "axios";
const apiUrl = import.meta.env.API_URL;

export const FamilyChatbot = async (content, startTime, endTime, imageFile) => {
  const token = localStorage.getItem("USER_TOKEN");

  // 폼 데이터 생성
  const formData = new FormData();
  formData.append("content", content);
  formData.append("startTime", startTime);
  formData.append("endTime", endTime);
  formData.append("image", imageFile); // 이미지 파일 추가

  try {
    console.log(
      "주소는 여기로 보냄:",
      `${apiUrl}/v1/chatbots/teachers/imageupload`
    );

    const response = await axios.post(
      `${apiUrl}/v1/chatbots/teachers/imageupload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      }
    );

    console.log("받아와줘:", response.data);
    return response.data;
  } catch (error) {
    console.error("요청 실패:", error);
    throw error;
  }
};
