import join from "./TeacherJoin.module.css";
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
    <div className={join.joinArray}>
      <h1 className={join.joinTitle}>회원가입</h1>
      <div className={join.joinFormArray}>
        <form action="" className={join.joinForm}>
          <input type="text" placeholder="아이디" />
          <input type="password" placeholder="비밀번호" />
          <input type="email" placeholder="이메일" />
          <input type="search" placeholder="학교 검색" />
          <input type="text" placeholder="이름" />
          <input type="text" placeholder="생년월일 8자리" />
          <input type="tel" placeholder="휴대전화 번호" />
          <div className={join.joinBtnArray}>
            <button className={join.joinBtn}>가입</button>
            <button className={join.joinBtn}>취소</button>
          </div>
        </form>
      </div>
      <div className={join.joinIconArray}>
        <img src={human} className={join.joinIcon} alt="human" />
        <img src={lock} className={join.joinIcon} alt="lock" />
        <img src={mail} className={join.joinIcon} alt="mail" />
        <img src={search} className={join.joinIcon} alt="search" />
        <img src={human} className={join.joinIcon} alt="human" />
        <img src={calendar} className={join.joinIcon} alt="calendar" />
        <img src={phone} className={join.joinIcon} alt="phone" />
      </div>
      <img src={round1} className={join.round1} alt="round1" />
      <img src={round2} className={join.round2} alt="round2" />
      <img src={round1} className={join.round3} alt="round1" />
    </div>
  );
};

export default TeacherJoin;
