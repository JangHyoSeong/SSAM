import { useState } from "react";
import styles from "./VideoEntry.module.scss";

const VideoEntry = () => {
  const [pinInput, setPinInput] = useState("");

  const handleInputChange = (e) => {
    setPinInput(e.target.value);
  };

  const isButtonEnabled = pinInput === "동의하기";

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <h1>
          본 상담은 교사의 교권 보호를 위하여{" "}
          <span className={styles.highlight}>자동 녹음</span> 및{" "}
          <span className={styles.highlight}>기록</span>됩니다
        </h1>
        <br />
        <h2>
          이러한 녹음 내용은 기밀로 처리되며 위에 명시된 목적으로만 사용됩니다
        </h2>
        <h2>
          화상 상담에 참여함으로써 귀하는 본 약관을 인정하고 동의하는 것으로
          간주됩니다
        </h2>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.inputBox}>
        <input
          type="text"
          className={styles.pinInput}
          placeholder="동의하기를 입력해주세요"
          value={pinInput}
          onChange={handleInputChange}
        />
        <button
          className={
            isButtonEnabled ? styles.joinButton : styles.joinButtonDisabled
          }
          disabled={!isButtonEnabled}
        >
          상담 참가
        </button>
      </div>
    </div>
  );
};

export default VideoEntry;
