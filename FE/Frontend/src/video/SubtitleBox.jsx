import styles from './Video.module.scss';

// SubtitleBox 컴포넌트: 음성 인식 결과를 자막으로 표시하는 React 컴포넌트
const SubtitleBox = ({ sttMessages, profileData }) => {
  return (
    // 자막을 감싸는 컨테이너
    <div className={styles.subTitleArray}>
      {/* 실제 자막이 표시되는 영역 */}
      <div className={styles.subTitle}>
        {/* sttMessages 배열을 순회하며 각 메시지를 렌더링 */}
        {sttMessages.map((msg, index) => (
          <div key={index}>
            {/* 메시지 발신자 표시 */}
            <strong>
              {/* 
                메시지의 connectionId가 현재 세션의 connectionId와 일치하면 본인,
                그렇지 않으면 "상대방"으로 표시.
                본인일 경우 profileData.name이 비어있으면 "익명"으로 표시.
              */}
              {msg.connectionId === msg.session?.connection.connectionId
                ? profileData.name === ""
                  ? "익명"
                  : profileData.name
                : "상대방"}{" "}
              :{" "}
            </strong>
            {/* 실제 메시지 내용 표시 */}
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtitleBox;