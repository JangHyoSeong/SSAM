import direct from "./Direct.module.scss";

const Direct = () => {
  return (
    <div className={direct.directArray}>
      <div className={direct.txtArray}>
        <h3>SSAM</h3>
        <h1>비용없이 사용 가능한 AI 서비스</h1>
        <div className={direct.txtP}>
          <p>상담을 어떻게 해야 할지 걱정되시나요?</p>
          <p>AI가 선생님의 상담을 도와드립니다</p>
        </div>
      </div>
      <div className={direct.detailArray}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Direct;
