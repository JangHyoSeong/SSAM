import axios from "axios";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TeacherLogin.module.scss";
import round1 from "../../../assets/round1.png";
import round2 from "../../../assets/round2.png";
import round3 from "../../../assets/round3.png";
import google from "../../../assets/google.png";
import naver from "../../../assets/naver.png";
import kakao from "../../../assets/kakao.png";

const TeacherLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:8081/v1/auth/login", {
        params: {
          username: username,
          password: password,
        },
      })
      .then(function (response) {
        console.log("axios 성공", response);
        alert("성공");
      })
      .catch(function (error) {
        console.error("axios 실패", error);
        alert("실패", error);
      });
  };

  return (
    <div className={styles.loginArray}>
      <h1 className={styles.loginTitle}>로그인</h1>
      <div className={styles.loginFormArray}>
        <div className={styles.loginBackground}>
          <form onSubmit={handleLogin} className={styles.loginForm}>
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
            <button type="submit" className={styles.loginBtn}>
              로그인
            </button>
            <div className={styles.loginRoute}>
              <NavLink to="/teacherjoin" className={styles.joinNavLink}>
                <p>회원가입</p>
              </NavLink>
              <p>아이디 / 비밀번호 찾기</p>
            </div>
            <button type="button" className={styles.googleBtn}>
              <img src={google} className={styles.googleImg} alt="google" />
              <p>구글로 시작하세요</p>
            </button>
            <button type="button" className={styles.naverBtn}>
              <img src={naver} className={styles.naverImg} alt="naver" />
              <p>네이버로 시작하세요</p>
            </button>
            <button type="button" className={styles.kakaoBtn}>
              <img src={kakao} className={styles.kakaoImg} alt="kakao" />
              <p>카카오로 시작하세요</p>
            </button>
          </form>
        </div>
      </div>
      <img src={round1} className={styles.round1} alt="round1" />
      <img src={round2} className={styles.round2} alt="round2" />
      <img src={round3} className={styles.round3} alt="round" />
    </div>
  );
};

export default TeacherLogin;
