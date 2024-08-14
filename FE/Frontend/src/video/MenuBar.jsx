// components/MenuBar.jsx
import React from "react";
import styles from "./Video.module.scss";
import whitelogo from "../assets/whitelogo.png";
import RECOn from "../assets/RECOn.png";
import RECOff from "../assets/RECOff.png";
import mikeOn from "../assets/mikeOn.png";
import mikeOff from "../assets/mikeOff.png";
import cameraOn from "../assets/cameraOn.png";
import cameraOff from "../assets/cameraOff.png";
import subtitleOn from "../assets/subtitleOn.png";
import subtitleOff from "../assets/subtitleOff.png";

const MenuBar = ({
  state,
  toggleRecording,
  toggleCamera,
  toggleMic,
  leaveSession,
  updateState,
}) => {
  return (
    <div className={styles.menubarArray}>
      <div className={styles.top}>
        <div className={styles.menubar}>
          <div className={styles.logoArray}>
            <img src={whitelogo} className={styles.logo} alt="Logo" />
          </div>
          <div className={styles.dayArray}>
            <p>{state.formattedDate.slice(0, 11)}</p>
          </div>
          <div className={styles.iconArray}>
            <button className={styles.btnIcon} onClick={toggleRecording}>
              <img
                src={state.isRecording ? RECOn : RECOff}
                className={styles.imgIcon}
                alt="Recording"
              />
            </button>

            <button
              className={styles.btnIcon}
              onClick={() => updateState({ showSubtitle: !state.showSubtitle })}
            >
              <img
                src={state.showSubtitle ? subtitleOff : subtitleOn}
                className={styles.imgIcon}
                alt="Subtitle"
              />
            </button>
            <button className={styles.btnIcon} onClick={toggleCamera}>
              <img
                src={state.isCameraOn ? cameraOn : cameraOff}
                className={styles.imgIcon}
                alt="Camera"
              />
            </button>
            <button className={styles.btnIcon} onClick={toggleMic}>
              <img
                src={state.isMicOn ? mikeOn : mikeOff}
                className={styles.imgIcon}
                alt="Microphone"
              />
            </button>
            <button
              className={`${styles.leaveSession} ${styles.btnIcon}`}
              onClick={leaveSession}
            >
              <h1>X</h1>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.timeArray}>
        <div className={styles.time}>
          <p>시작 시간 : {state.formattedDate.slice(13, 20)}</p>
          {!state.isTimerEnded ? (
            <p>남은 시간 : {state.remainingTime}</p>
          ) : (
            <p>상담 시간 종료</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
