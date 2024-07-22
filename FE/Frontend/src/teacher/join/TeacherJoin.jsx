import { useState } from "react";
import axios from "../../axiosConfig";
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
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    school: "",
    name: "",
    birthdate: "",
    phone: "",
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
      // 백엔드 API에 회원가입 요청을 보냄
      const response = await axios.post("/signup", formData);
      // 응답 데이터를 활용하여 추가 작업 수행
      console.log(response.data);
      alert("회원가입이 완료되었습니다.");
    } catch (error) {
      // 오류 발생 시 사용자에게 알림
      alert(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className={join.joinArray}>
      <h1 className={join.joinTitle}>회원가입</h1>
      <div className={join.joinFormArray}>
        <div className={join.joinBackground}>
          <form onSubmit={handleSubmit} className={join.joinForm}>
            <div>
              <img src={human} className={join.joinIcon} alt="human" />
              <input
                type="text"
                name="username"
                value={formData.username}
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
                value={formData.password}
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
                value={formData.email}
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
                value={formData.school}
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
                value={formData.name}
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
                value={formData.birthdate}
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
                value={formData.phone}
                onChange={handleChange}
                placeholder="휴대전화 번호"
                required
              />
            </div>
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

      <img src={round1} className={join.round1} alt="round1" />
      <img src={round2} className={join.round2} alt="round2" />
      <img src={round1} className={join.round3} alt="round1" />
    </div>
  );
};

export default TeacherJoin;
