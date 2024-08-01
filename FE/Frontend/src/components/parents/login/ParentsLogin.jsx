import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../../utils/axiosConfig";
import login from "./ParentsLogin.module.scss";
import round1 from "../../../assets/round1.png";
import round2 from "../../../assets/round2.png";
import google from "../../../assets/google.png";
import naver from "../../../assets/naver.png";
import kakao from "../../../assets/kakao.png";

const ParentsLogin = () => {
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 입력값이 변경될 때 상태를 업데이트하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 백엔드 API에 로그인 요청을 보냄
      const response = await axios.post("/login", formData);
      // 응답 데이터를 활용하여 추가 작업 수행
      console.log(response.data);
      alert("로그인이 완료되었습니다.");
      // 로그인 완료 후 메인 페이지로 리다이렉트
      // window.location.href = "/main";
    } catch (error) {
      // 오류 발생 시 사용자에게 알림
      alert(error.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={login.loginArray}>
      <h1 className={login.loginTitle}>로그인</h1>
      <div className={login.loginFormArray}>
        <div className={login.loginBackground}>
          <form onSubmit={handleSubmit} className={login.loginForm}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
            <NavLink
              to="/parentssubpage"
              type="submit"
              className={login.loginBtn}
            >
              로그인
            </NavLink>
            <div className={login.loginRoute}>
              <NavLink to="/parentsjoin" className={login.joinNavLink}>
                <p>회원가입</p>
              </NavLink>
              <p>아이디 / 비밀번호 찾기</p>
            </div>
            <button type="button" className={login.googleBtn}>
              <img src={google} className={login.googleImg} alt="google" />
              <p>구글로 시작하세요</p>
            </button>
            <button type="button" className={login.naverBtn}>
              <img src={naver} className={login.naverImg} alt="naver" />
              <p>네이버로 시작하세요</p>
            </button>
            <button type="button" className={login.kakaoBtn}>
              <img src={kakao} className={login.kakaoImg} alt="kakao" />
              <p>카카오로 시작하세요</p>
            </button>
          </form>
        </div>
      </div>
      <img src={round1} className={login.round1} alt="round1" />
      <img src={round2} className={login.round2} alt="round2" />
      <img src={round1} className={login.round3} alt="round1" />
    </div>
  );
};

export default ParentsLogin;
