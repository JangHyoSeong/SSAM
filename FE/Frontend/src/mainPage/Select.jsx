// 메인 페이지에서의 역할 선택 컴포넌트
import { NavLink } from "react-router-dom";
import styles from "./Select.module.scss";
import teacher from "../assets/teacher.png";
import parents from "../assets/parents.png";
import round1 from "../assets/round1.png";
import round2 from "../assets/round2.png";
import round3 from "../assets/round3.png";

const Select = () => {
  return (
    <div className={styles.selectArray}>
      <h1 className={styles.mainTxt}>온라인 화상 상담 시스템, SSAM</h1>
      <div className={styles.menuBoxArray}>
        <NavLink
          to="/teacherlogin"
          className={`${styles.menuBox} ${styles.menuBox1}`}
        >
          <div className={styles.menuTxt}>
            <h1>선생님</h1>
            <h3>선생님으로 시작하세요</h3>
            <div className={styles.imgArray}>
              <img src={teacher} className={styles.teacherImg} alt="teacher" />
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/parentslogin"
          className={`${styles.menuBox} ${styles.menuBox2}`}
        >
          <div className={styles.menuTxt}>
            <h1>학생 / 학부모</h1>
            <h3>학생과 자녀가 있는 학부모</h3>
            <div className={styles.imgArray}>
              <img src={parents} className={styles.parentsImg} alt="parents" />
            </div>
          </div>
        </NavLink>
      </div>
      <img src={round1} className={styles.round1} alt="round1" />
      <img src={round2} className={styles.round2} alt="round2" />
      <img src={round3} className={styles.round3} alt="round3" />
      <p className={styles.scroll}>Scroll ▽</p>
    </div>
  );
};

export default Select;
