// Axios 라이브러리를 가져옵니다.
import axios from 'axios';

// Axios 인스턴스를 생성합니다.
const instance = axios.create({
  // 요청을 보낼 기본 URL을 설정합니다. 이 URL은 백엔드 API의 기본 경로입니다.
  baseURL: 'https://your-backend-api-url.com/api', // 백엔드 API URL로 변경
});

// 생성한 Axios 인스턴스를 기본 내보내기로 내보냅니다.
// 이렇게 하면 다른 파일에서 이 인스턴스를 가져와 사용할 수 있습니다.
export default instance;
