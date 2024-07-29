// src/components/TeacherJoin.jsx
import useAuthStore from "../../store/AuthStore";
import join from "./TeacherJoin.module.scss";
import round1 from "../../assets/round1.png";
import round2 from "../../assets/round2.png";
import human from "../../assets/human.png";
import lock from "../../assets/lock.png";
import mail from "../../assets/mail.png";
import search from "../../assets/search.png";
import calendar from "../../assets/calendar.png";
import phone from "../../assets/phone.png";

const TeacherJoin = () => {
  const {
    username,
    password,
    email,
    school,
    name,
    birthdate,
    phone: phoneValue,
    setFormData,
    signup,
  } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup({
      username,
      password,
      email,
      school,
      name,
      birthdate,
      phone: phoneValue,
    });
  };

  return (
    <div className={join.joinArray}>
      <h1 className={join.joinTitle}>회원가입</h1>
      <div className={join.joinFormArray}>
        <div className={join.joinBtnFormArray}>
          <div className={join.joinBackground}>
            <form onSubmit={handleSubmit} className={join.joinForm}>
              <div>
                <img src={human} className={join.joinIcon} alt="human" />
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  placeholder="아이디"
                  required
                />
              </div>
              <hr />
              <div>
                <img src={lock} className={join.joinIcon} alt="lock" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="비밀번호"
                  required
                />
              </div>
              <hr />
              <div>
                <img src={mail} className={join.joinIcon} alt="mail" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="이메일"
                  required
                />
              </div>
              <hr />
              <div>
                <img src={search} className={join.joinIcon} alt="search" />
                <input
                  type="search"
                  name="school"
                  value={school}
                  onChange={handleChange}
                  placeholder="학교 검색"
                  required
                />
              </div>
              <hr />
              <div>
                <img src={human} className={join.joinIcon} alt="human" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="이름"
                  required
                />
              </div>
              <hr />
              <div>
                <img src={calendar} className={join.joinIcon} alt="calendar" />
                <input
                  type="text"
                  name="birthdate"
                  value={birthdate}
                  onChange={handleChange}
                  placeholder="생년월일 8자리"
                  required
                />
              </div>
              <hr />
              <div>
                <img src={phone} className={join.joinIcon} alt="phone" />
                <input
                  type="tel"
                  name="phone"
                  value={phoneValue}
                  onChange={handleChange}
                  placeholder="휴대전화 번호"
                  required
                />
              </div>
              <hr />
              <div className={join.joinBtnArray}>
                <button type="submit" className={join.joinBtn}>
                  가입
                </button>
                <button type="button" className={join.joinBtn}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <img src={round1} className={join.round1} alt="round1" />
      <img src={round2} className={join.round2} alt="round2" />
      <img src={round1} className={join.round3} alt="round1" />
    </div>
  );
};

export default TeacherJoin;
