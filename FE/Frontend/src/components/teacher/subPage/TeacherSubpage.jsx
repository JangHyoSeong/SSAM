import InviteCode from "./InviteCode";
import SubpageImg1 from "../../../assets/subPage1.png";
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
            src={SubpageImg1}
            className={styles.subpageImg}
            alt="SubpageImg1"
          />
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
