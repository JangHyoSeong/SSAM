// 메인 페이지에서의 역할 선택 컴포넌트
import { NavLink } from "react-router-dom";
import select from "./Select.module.scss";
import teacher from "../assets/teacher.png";
import parents from "../assets/parents.png";
import round1 from "../assets/round1.png";
import round2 from "../assets/round2.png";

const Select = () => {
  return (
    <div className={select.selectArray}>
      <h1 className={select.mainTxt}>온라인 화상 상담 시스템, SSAM</h1>
      <div className={select.menuBoxArray}>
        <NavLink
          to="/teacherlogin"
          className={`${select.menuBox} ${select.menuBox1}`}
        >
          <div className={select.menuTxt}>
            <h1>선생님</h1>
            <h3>선생님으로 시작하세요</h3>
            <div className={select.imgArray}>
              <img src={teacher} className={select.teacherImg} alt="teacher" />
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/parentslogin"
          className={`${select.menuBox} ${select.menuBox2}`}
        >
          <div className={select.menuTxt}>
            <h1>학생 / 학부모</h1>
            <h3>학생과 자녀가 있는 학부모</h3>
            <div className={select.imgArray}>
              <img src={parents} className={select.parentsImg} alt="parents" />
            </div>
          </div>
        </NavLink>
      </div>
      <img src={round1} className={select.round1} alt="round1" />
      <img src={round2} className={select.round2} alt="round2" />
      <img src={round1} className={select.round3} alt="round1" />
      <p className={select.scroll}>Scroll ▽</p>
    </div>
  );
};

export default Select;
