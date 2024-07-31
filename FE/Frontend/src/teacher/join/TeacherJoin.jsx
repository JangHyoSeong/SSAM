import useAuthStore from '../../store/AuthStore';
import styles from './TeacherJoin.module.scss';
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
    <div className={styles.joinArray}>
      <h1 className={styles.joinTitle}>회원가입</h1>
      <div className={styles.joinFormArray}>
        <div className={styles.joinBtnFormArray}>
          <div className={styles.joinBackground}>
            <form onSubmit={handleSubmit} className={styles.joinForm}>
              <div>
                <img src={human} className={styles.joinIcon} alt="human" />
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
                <img src={lock} className={styles.joinIcon} alt="lock" />
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
                <img src={mail} className={styles.joinIcon} alt="mail" />
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
                <img src={search} className={styles.joinIcon} alt="search" />
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
                <img src={human} className={styles.joinIcon} alt="human" />
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
                <img src={calendar} className={styles.joinIcon} alt="calendar" />
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
                <img src={phone} className={styles.joinIcon} alt="phone" />
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
              <div className={styles.joinBtnArray}>
                <button type="submit" className={styles.joinBtn}>
                  가입
                </button>
                <button type="button" className={styles.joinBtn} onClick={() => window.location.reload()}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <img src={round1} className={styles.round1} alt="round1" />
      <img src={round2} className={styles.round2} alt="round2" />
      <img src={round3} className={styles.round3} alt="round3" />
    </div>
  );
};

export default TeacherJoin;