import styles from "./Video.module.scss";
import whitelogo from "../assets/whitelogo.png";
import whitelock from "../assets/whitelock.png";
import whiteshare from "../assets/whiteshare.png";
import whitecamera from "../assets/whitecamera.png";
import whitemike from "../assets/whitemike.png";
import whitevideo from "../assets/whitevideo.png";

function Video() {
  return (
    <div className={styles.videoArray}>
      <div className={styles.top}>
        <div className={styles.menubarArray}>
          <div className={styles.menubar}>
            <div className={styles.logoArray}>
              <img src={whitelogo} className={styles.logo} alt="Logo" />
            </div>
            <div className={styles.dayArray}>
              <p>2024. 08. 01 목요일</p>
              <p>000학부모 상담</p>
            </div>
            <div className={styles.iconArray}>
              <img src={whitelock} alt="Lock" />
              <img src={whiteshare} alt="Share" />
              <img src={whitecamera} alt="Camera" />
              <img src={whitemike} alt="Microphone" />
              <img src={whitevideo} alt="Video" />
            </div>
          </div>
        </div>
        <div className={styles.timeArray}>
          <div className={styles.time}>
            <h1>04:49</h1>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.screen}>
          <div className={styles.youVideoArray}>
            <div className={styles.youVideo}></div>
          </div>
          <div className={styles.myVideoArray}>
            <div className={styles.myVideo}></div>
          </div>
          <div className={styles.subTitleArray}>
            <div className={styles.subTitle}></div>
          </div>
        </div>
        <div className={styles.chatingArray}>
          <div className={styles.chating}>
            <div className={styles.chatForm}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
