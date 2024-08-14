import InviteCode from "./InviteCode";
import SubpageImg1 from "../../../assets/subPage1.png";
import SubpageImg2 from "../../../assets/SSAM_main.png";
import Light from "../../../assets/Light.gif";

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
          <button className={styles.youtubeLink} onClick={redirectToYouTube} />
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
