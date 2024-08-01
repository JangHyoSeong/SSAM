// import useAuthStore from '../../store/AuthStore';
// import styles from './TeacherJoin.module.scss';
// import round1 from '../../assets/round1.png';
// import round2 from '../../assets/round2.png';
// import round3 from '../../assets/round3.png';
// import human from '../../assets/human.png';
// import lock from '../../assets/lock.png';
// import mail from '../../assets/mail.png';
// import search from '../../assets/search.png';
// import calendar from '../../assets/calendar.png';
// import phone from '../../assets/phone.png';

// const TeacherJoin = () => {
//   const {
//     username,
//     password,
//     email,
//     school,
//     name,
//     birthdate,
//     phone: phoneValue,
//     setFormData,
//     signup,
//   } = useAuthStore();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(name, value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await signup({
//       username,
//       password,
//       email,
//       school,
//       name,
//       birthdate,
//       phone: phoneValue,
//     });
//   };

//   return (
//     <div className={styles.joinArray}>
//       <h1 className={styles.joinTitle}>회원가입</h1>
//       <div className={styles.joinFormArray}>
//         <div className={styles.joinBtnFormArray}>
//           <div className={styles.joinBackground}>
//             <form onSubmit={handleSubmit} className={styles.joinForm}>
//               <div>
//                 <img src={human} className={styles.joinIcon} alt="human" />
//                 <input
//                   type="text"
//                   name="username"
//                   value={username}
//                   onChange={handleChange}
//                   placeholder="아이디"
//                   required
//                 />
//               </div>
//               <hr />
//               <div>
//                 <img src={lock} className={styles.joinIcon} alt="lock" />
//                 <input
//                   type="password"
//                   name="password"
//                   value={password}
//                   onChange={handleChange}
//                   placeholder="비밀번호"
//                   required
//                 />
//               </div>
//               <hr />
//               <div>
//                 <img src={mail} className={styles.joinIcon} alt="mail" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={email}
//                   onChange={handleChange}
//                   placeholder="이메일"
//                   required
//                 />
//               </div>
//               <hr />
//               <div>
//                 <img src={search} className={styles.joinIcon} alt="search" />
//                 <input
//                   type="search"
//                   name="school"
//                   value={school}
//                   onChange={handleChange}
//                   placeholder="학교 검색"
//                   required
//                 />
//               </div>
//               <hr />
//               <div>
//                 <img src={human} className={styles.joinIcon} alt="human" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={name}
//                   onChange={handleChange}
//                   placeholder="이름"
//                   required
//                 />
//               </div>
//               <hr />
//               <div>
//                 <img src={calendar} className={styles.joinIcon} alt="calendar" />
//                 <input
//                   type="text"
//                   name="birthdate"
//                   value={birthdate}
//                   onChange={handleChange}
//                   placeholder="생년월일 8자리"
//                   required
//                 />
//               </div>
//               <hr />
//               <div>
//                 <img src={phone} className={styles.joinIcon} alt="phone" />
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={phoneValue}
//                   onChange={handleChange}
//                   placeholder="휴대전화 번호"
//                   required
//                 />
//               </div>
//               <hr />
//               <div className={styles.joinBtnArray}>
//                 <button type="submit" className={styles.joinBtn}>
//                   가입
//                 </button>
//                 <button type="button" className={styles.joinBtn} onClick={() => window.location.reload()}>
//                   취소
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       <img src={round1} className={styles.round1} alt="round1" />
//       <img src={round2} className={styles.round2} alt="round2" />
//       <img src={round3} className={styles.round3} alt="round3" />
//     </div>
//   );
// };

// export default TeacherJoin;

import { useState } from 'react';
import axios from 'axios';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    schoolId: '',
    name: '',
    birth: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/v1/auth/teachers', formData)
      .then(function (response) {
        console.log('Server Response:', response);
        alert('성공');
      })
      .catch(function (error) {
        console.error('Error in registration:', error);
        alert('실패', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="text"
        name="school"
        value={formData.schoolId}
        onChange={handleChange}
        placeholder="School"
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="birth"
        value={formData.birth}
        onChange={handleChange}
        placeholder="Birthdate"
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;
