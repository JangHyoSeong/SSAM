// import { NavLink } from 'react-router-dom';
// import useAuthStore from '../../store/AuthStore'
// import styles from './TeacherLogin.module.scss';
// import round1 from '../../assets/round1.png';
// import round2 from '../../assets/round2.png';
// import round3 from '../../assets/round3.png';
// import google from '../../assets/google.png';
// import naver from '../../assets/naver.png';
// import kakao from '../../assets/kakao.png';

// const TeacherLogin = () => {
//   const { username, password, setFormData, login: handleLogin } = useAuthStore();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(name, value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     handleLogin({ username, password });
//   };

//   return (
//     <div className={styles.loginArray}>
//       <h1 className={styles.loginTitle}>로그인</h1>
//       <div className={styles.loginFormArray}>
//         <div className={styles.loginBackground}>
//           <form onSubmit={handleSubmit} className={styles.loginForm}>
//             <input
//               type="text"
//               name="username"
//               value={username}
//               onChange={handleChange}
//               placeholder="아이디"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               value={password}
//               onChange={handleChange}
//               placeholder="비밀번호"
//               required
//             />
//             <button type="submit" className={styles.loginBtn}>
//               로그인
//             </button>
//             <div className={styles.loginRoute}>
//               <NavLink to="/teacherjoin" className={styles.joinNavLink}>
//                 <p>회원가입</p>
//               </NavLink>
//               <p>아이디 / 비밀번호 찾기</p>
//             </div>
//             <button type="button" className={styles.googleBtn}>
//               <img src={google} className={styles.googleImg} alt="google" />
//               <p>구글로 시작하세요</p>
//             </button>
//             <button type="button" className={styles.naverBtn}>
//               <img src={naver} className={styles.naverImg} alt="naver" />
//               <p>네이버로 시작하세요</p>
//             </button>
//             <button type="button" className={styles.kakaoBtn}>
//               <img src={kakao} className={styles.kakaoImg} alt="kakao" />
//               <p>카카오로 시작하세요</p>
//             </button>
//           </form>
//         </div>
//       </div>
//       <img src={round1} className={styles.round1} alt="round1" />
//       <img src={round2} className={styles.round2} alt="round2" />
//       <img src={round3} className={styles.round3} alt="round" />
//     </div>
//   );
// };

// export default TeacherLogin;

import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        console.log("Login successful:", response);
        alert("Login 성공");
      })
      .catch(function (error) {
        console.error("Login failed:", error);
        alert("Login 실패: " + error.message);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
