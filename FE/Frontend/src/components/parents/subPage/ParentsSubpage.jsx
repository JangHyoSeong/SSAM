import EnterCode from "./EnterCode";
import ParentsSelect from "./ParentsSelect";
import SubpageImg1 from "../../../assets/subPage1.png";
import styles from "./ParentsSubpage.module.scss";

const ParentsSubpage = () => {
  return (
    <>
      <div className={styles.subPageContainer}>
        <img
          src={SubpageImg1}
          className={styles.subpageImg}
          alt="SubpageImg1"
        />
        <div className={styles.enterCodeContainer}>
          <EnterCode />
        </div>
        <div className={styles.parentsSelectContainer}></div>
      </div>
      <ParentsSelect />
    </>
  );
};

export default ParentsSubpage;
