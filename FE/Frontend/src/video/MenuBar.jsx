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

// MenuBar 컴포넌트: 화상 채팅의 상단 메뉴바를 구현하는 React 컴포넌트
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
          {/* 로고 영역 */}
          <div className={styles.logoArray}>
            <img src={whitelogo} className={styles.logo} alt="Logo" />
          </div>
          {/* 날짜 표시 영역 */}
          <div className={styles.dayArray}>
            <p>{state.formattedDate.slice(0, 11)}</p>
          </div>
          {/* 기능 버튼 영역 */}
          <div className={styles.iconArray}>
            {/* 녹화 토글 버튼 */}
            <button className={styles.btnIcon} onClick={toggleRecording}>
              <img
                src={state.isRecording ? RECOn : RECOff}
                className={styles.imgIcon}
                alt="Recording"
              />
            </button>

            {/* 자막 토글 버튼 */}
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
            {/* 카메라 토글 버튼 */}
            <button className={styles.btnIcon} onClick={toggleCamera}>
              <img
                src={state.isCameraOn ? cameraOn : cameraOff}
                className={styles.imgIcon}
                alt="Camera"
              />
            </button>
            {/* 마이크 토글 버튼 */}
            <button className={styles.btnIcon} onClick={toggleMic}>
              <img
                src={state.isMicOn ? mikeOn : mikeOff}
                className={styles.imgIcon}
                alt="Microphone"
              />
            </button>
            {/* 세션 종료 버튼 */}
            <button
              className={`${styles.leaveSession} ${styles.btnIcon}`}
              onClick={leaveSession}
            >
              <h1>X</h1>
            </button>
          </div>
        </div>
      </div>
      {/* 시간 정보 표시 영역 */}
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