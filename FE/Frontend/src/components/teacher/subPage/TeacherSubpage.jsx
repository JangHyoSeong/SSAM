import InviteCode from "./InviteCode";
import SubpageImg1 from "../../../assets/subPage1.png";
import SubpageImg2 from "../../../assets/SSAM_main.png";
import Light from "../../../assets/Light.gif";
import Arrow from "../../../assets/arrow1.png";

import TeacherSelect from "./TeacherSelect";
import styles from "./TeacherSubpage.module.scss";

const TeacherSubpage = () => {
  const redirectToYouTube = () => {
    window.location.href = "https://www.youtube.com";
  };

  return (
    <>
      <div className={styles.subPageContainer}>
        {/* 배경 이미지 */}
        <div className={styles.imageContainer}>
          {/* 영상 보러가기 버튼 */}
          <div className={styles.videoLink} onClick={redirectToYouTube}>
            <span>영상 보러가기</span>
            <img src={Arrow} className={styles.arrowIcon} alt="Arrow" />
          </div>
          <img
            src={SubpageImg2}
            className={styles.subpageImg}
            alt="SubpageImg1"
          />
          {/* Light 이미지 추가 */}
          <img src={Light} className={styles.lightImg} alt="Light" />
        </div>
        {/* InviteCode 컴포넌트를 포함하는 컨테이너 */}
        <div className={styles.inviteCodeContainer}>
          <InviteCode />
        </div>
      </div>
      <TeacherSelect />
    </>
  );
};

export default TeacherSubpage;
