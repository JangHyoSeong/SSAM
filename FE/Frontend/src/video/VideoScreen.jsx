// import Draggable from 'react-draggable';
import UserVideoComponent from './UserVideoComponent';
import styles from './Video.module.scss';

// VideoScreen 컴포넌트: 화상 채팅 화면을 구성하는 React 컴포넌트
const VideoScreen = ({ state }) => {
  return (
    // 전체 화면을 감싸는 컨테이너
    <div className={styles.screen}>
      {/* 비디오 위치를 지정하는 컨테이너 */}
      {/* 자막 표시 여부에 따라 높이를 조절합니다. */}
      <div className={`${styles.videoPosition} ${!state.showSubtitle ? styles.fullHeight : ""}`}>
        {/* 메인 스트림 매니저(자신의 비디오)가 존재하는 경우 표시 */}
        {state.mainStreamManager !== null && (
          <div className={styles.videoItem}>
            <UserVideoComponent streamManager={state.mainStreamManager} />
          </div>
        )}
        {/* 구독자(다른 참가자들)의 비디오를 매핑하여 표시 */}
        {state.subscribers.map((sub) => (
          // 각 구독자의 연결 ID를 키로 사용
          <div key={sub.stream.connection.connectionId}>
            <div className={styles.othervideoItem}>
              <UserVideoComponent streamManager={sub} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoScreen;