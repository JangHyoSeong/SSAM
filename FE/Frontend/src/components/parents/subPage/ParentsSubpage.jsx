import EnterCode from "./EnterCode";
import ParentsSelect from "./ParentsSelect";
import SubpageImg1 from "../../../assets/subPage1.png";
import styles from "./ParentsSubpage.module.scss";

const ParentsSubpage = () => {
  const redirectToYouTube = () => {
    window.location.href = "https://www.youtube.com";
  };
  return (
    <>
      <div className={styles.subPageContainer}>
        {/* 배경 이미지 */}
        <div className={styles.imageContainer}>
        <button className={styles.youtubeLink} onClick={redirectToYouTube} />
          <img
            src={SubpageImg1}
            className={styles.subpageImg}
            alt="SubpageImg1"
          />
        </div>
        {/* EnterCode 컴포넌트를 포함하는 컨테이너 */}
        <div className={styles.enterCodeContainer}>
          <EnterCode />
        </div>
      </div>
      <ParentsSelect />
    </>
  );
};

export default ParentsSubpage;
