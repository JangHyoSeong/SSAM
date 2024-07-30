// 메인 페이지 설명란

import explan from "./Explan.module.scss";
import explanimg from "../assets/explan.png";

const Explan = () => {
  return (
    <div className={explan.explanArray}>
      <div className={explan.imgArray}>
        <img src={explanimg} className={explan.img} />
      </div>
      <div className={explan.txtArray}>
        <h3>SSAM</h3>
        <h1>새로 만나는 화상상담</h1>
        <div className={explan.txtP}>
          <p>AI를 활용한 스마트 화상상담 서비스로</p>
          <p>선생님들의 상담에 도움을 드립니다</p>
        </div>
      </div>
    </div>
  );
};

export default Explan;
