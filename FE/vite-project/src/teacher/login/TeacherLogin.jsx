import "./TeacherLogin.css";
import round1 from "../../assets/round1.png";
import round2 from "../../assets/round2.png";
import google from "../../assets/google.png";
import naver from "../../assets/naver.png";
import kakao from "../../assets/kakao.png";

const TeacherLogin = () => {
  return (
    <div>
      <h1 className="login-title">로그인</h1>
      <div className="login-array">
        <div className="login-background"></div>
        <form action="" className="login-form">
          <input type="text" placeholder="아이디" />
          <input type="password" placeholder="비밀번호" />
          <button className="login-btn">로그인</button>
          <div className="login-route">
            <p>회원가입</p>
            <p>아이디 / 비밀번호 찾기</p>
          </div>
          <img src={google} className="google-img" alt="google" />
          <img src={naver} className="naver-img" alt="naver" />
          <img src={kakao} className="kakao-img" alt="kakao" />
          <button className="google-btn">구글로 시작하세요</button>
          <button className="naver-btn">네이버로 시작하세요</button>
          <button className="kakao-btn">카카오로 시작하세요</button>
        </form>
      </div>
      <img src={round1} className="round1" alt="round1" />
      <img src={round2} className="round2" alt="round2" />
      <img src={round1} className="round3" alt="round1" />
    </div>
  );
};

export default TeacherLogin;
