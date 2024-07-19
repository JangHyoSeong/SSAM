import "./TeacherJoin.css";
import round1 from "../../assets/round1.png";
import round2 from "../../assets/round2.png";
import human from "../../assets/human.png";
import lock from "../../assets/lock.png";
import mail from "../../assets/mail.png";
import search from "../../assets/search.png";
import calendar from "../../assets/calendar.png";
import phone from "../../assets/phone.png";

const TeacherJoin = () => {
  return (
    <div>
      <h1 className="join-title">회원가입</h1>
      <div className="join-array">
        <form action="" className="join-form">
          <input type="text" placeholder="아이디" />
          <input type="password" placeholder="비밀번호" />
          <input type="email" placeholder="이메일" />
          <input type="search" placeholder="학교 검색" />
          <input type="text" placeholder="이름" />
          <input type="text" placeholder="생년월일 8자리" />
          <input type="tel" placeholder="휴대전화 번호" />
          <div className="join-btn-array">
            <input type="submit" className="join-btn" value={"완료"}></input>
            <input type="submit" className="join-btn" value={"취소"}></input>
          </div>
        </form>
      </div>
      <div className="join-icon-array">
        <img src={human} className="join-icon" alt="human" />
        <img src={lock} className="join-icon" alt="lock" />
        <img src={mail} className="join-icon" alt="mail" />
        <img src={search} className="join-icon" alt="search" />
        <img src={human} className="join-icon" alt="human" />
        <img src={calendar} className="join-icon" alt="calendar" />
        <img src={phone} className="join-icon" alt="phone" />
      </div>
      <img src={round1} className="round1" alt="round1" />
      <img src={round2} className="round2" alt="round2" />
      <img src={round1} className="round3" alt="round1" />
    </div>
  );
};

export default TeacherJoin;