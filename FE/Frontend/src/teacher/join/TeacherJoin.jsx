// src/components/TeacherJoin.jsx
import useAuthStore from '../../store/AuthStore';
import join from './TeacherJoin.module.scss';
import round1 from '../../assets/round1.png';
import round2 from '../../assets/round2.png';
import round3 from '../../assets/round3.png';
import human from '../../assets/human.png';
import lock from '../../assets/lock.png';
import mail from '../../assets/mail.png';
import search from '../../assets/search.png';
import calendar from '../../assets/calendar.png';
import phone from '../../assets/phone.png';

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
    await signup({
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
                <button type="button" className={join.joinBtn} onClick={() => window.location.reload()}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <img src={round1} className={join.round1} alt="round1" />
      <img src={round2} className={join.round2} alt="round2" />
      <img src={round3} className={join.round3} alt="round3" />
    </div>
  );
};

export default TeacherJoin;

// import { useState } from 'react';
// import axios from 'axios';

// function SignupForm() {
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//         email: '',
//         school: '',
//         name: '',
//         birthdate: '',
//         phone: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('https://i11e201.p.ssafy.io/api/v1/auth/teachers', formData);
//             alert('회원가입 성공: ' + response.data.message);
//         } catch (error) {
//             console.error('회원가입 실패: ', error);
//             alert('회원가입 실패: ' + (error.response?.data?.message || '서버 오류'));
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <label>
//                 Username:
//                 <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
//             </label>
//             <label>
//                 Password:
//                 <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
//             </label>
//             <label>
//                 Email:
//                 <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
//             </label>
//             <label>
//                 School:
//                 <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="School" required />
//             </label>
//             <label>
//                 Name:
//                 <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
//             </label>
//             <label>
//                 Birthdate:
//                 <input type="text" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="Birthdate (YYYYMMDD)" required />
//             </label>
//             <label>
//                 Phone:
//                 <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
//             </label>
//             <button type="submit">Sign Up</button>
//         </form>
//     );
// }

// export default SignupForm;
