import styles from "./Explan.module.scss";
import explanimg from "../../assets/explan.png";

const Explan = () => {
  return (
    <div className={styles.explanArray}>
      <div className={styles.imgArray}>
        <img src={explanimg} className={styles.img} alt="Explanation" />
      </div>
      <div className={styles.txtArray}>
        <h3>SSAM</h3>
        <h1>새로 만나는 화상상담</h1>
        <div className={styles.txtP}>
          <p>AI를 활용한 스마트 화상상담 서비스로</p>
          <p>선생님들의 상담에 도움을 드립니다</p>
        </div>
      </div>
    </div>
  );
};

export default Explan;
