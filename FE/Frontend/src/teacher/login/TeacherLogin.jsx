// src/components/TeacherLogin.jsx
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/AuthStore'
import login from './TeacherLogin.module.scss';
import round1 from '../../assets/round1.png';
import round2 from '../../assets/round2.png';
import google from '../../assets/google.png';
import naver from '../../assets/naver.png';
import kakao from '../../assets/kakao.png';

const TeacherLogin = () => {
  const { username, password, setFormData, login: handleLogin } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLogin({ username, password });
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
              <NavLink to="/teacherjoin" className={login.joinNavLink}>
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

export default TeacherLogin;
