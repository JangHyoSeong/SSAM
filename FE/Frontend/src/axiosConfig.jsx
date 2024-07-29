// Axios 라이브러리 임포트
import axios from 'axios';

// Axios 인스턴스 생성
const instance = axios.create({
  // 요청을 보낼 기본 URL 설정. 이 URL은 백엔드 API의 기본 경로입니다.
  baseURL: 'http://localhost:8080/', // Spring 백엔드 API URL로 변경
});

// 생성한 Axios 인스턴스를 기본 익스포트로 내보내기
// 이를 통해 다른 파일에서 이 인스턴스를 임포트하고 사용할 수 있습니다.
export default instance;
