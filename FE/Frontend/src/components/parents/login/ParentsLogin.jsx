import { NavLink } from "react-router-dom";
import login from "./ParentsLogin.module.scss";
import { loginUser } from "../../../apis/user";
import useLoginStore from "../../../store/AuthStore";

// 이미지
import round1 from "../../../assets/round1.png";
import round2 from "../../../assets/round2.png";
import google from "../../../assets/google.png";
import naver from "../../../assets/naver.png";
import kakao from "../../../assets/kakao.png";

const ParentsLogin = () => {
  const { username, password, handleChange, setLoggedIn } = useLoginStore(
    (state) => ({
      username: state.username,
      password: state.password,
      handleChange: state.handleChange,
      setLoggedIn: state.setLoggedIn,
    })
  );

  // 폼이 제출될 때 호출된다.
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // loginUser 함수를 사용하여 로그인 요청을 보낸다.
      const response = await loginUser(username, password);
      console.log(response);
      const token = response.headers.authorization;
      localStorage.setItem("USER_TOKEN", token);
      localStorage.setItem("USER_NAME", username);
      console.log("axios 성공", response);
      setLoggedIn(true);
      window.location.replace("/studentsubpage");
    } catch (error) {
      console.error("axios 실패", error);
      if (error.response && error.response.status === 401) {
        alert("로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.");
      } else {
        alert(
          "로그인 실패: " + (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <div className={login.loginArray}>
      <h1 className={login.loginTitle}>로그인</h1>
      <div className={login.loginFormArray}>
        <div className={login.loginBackground}>
          <form onSubmit={handleLogin} className={login.loginForm}>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="아이디"
              required
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
            />
            <button type="submit" className={login.loginBtn}>
              로그인
            </button>
            <div className={login.loginRoute}>
              <NavLink to="/studentjoin" className={login.joinNavLink}>
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
