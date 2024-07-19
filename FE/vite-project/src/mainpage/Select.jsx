// 메인 페이지 선택란

import "./Select.css";
import teacher from "../assets/teacher.png";
import parents from "../assets/parents.png";
import round1 from "../assets/round1.png";
import round2 from "../assets/round2.png";
import arrow from "../assets/arrow.png";

const Select = () => {
  return (
    <div className="select-array">
      <h1 className="main-txt">온라인 화상 상담 시스템, SSAM</h1>
      <div className="start-box">
        <div className="teacher-box">
          <div className="teacher-txt">
            <h1>선생님</h1>
            <h3>선생님으로 시작하세요</h3>
          </div>
          <img src={arrow} className="arrow-img1" alt="arrow" />
          <img src={teacher} className="teacher-img" alt="teacher" />
        </div>
        <div className="parents-box">
          <div className="parents-txt">
            <h1>학생 / 학부모</h1>
            <h3>학생과 자녀가 있는 학부모</h3>
          </div>
          <img src={arrow} className="arrow-img2" alt="arrow" />
          <img src={parents} className="parents-img" alt="parents" />
        </div>
      </div>
      <img src={round1} className="round1" alt="round1" />
      <img src={round2} className="round2" alt="round2" />
      <img src={round1} className="round3" alt="round1" />
      <p className="scroll">Scroll ▽</p>
    </div>
  );
};

export default Select;
