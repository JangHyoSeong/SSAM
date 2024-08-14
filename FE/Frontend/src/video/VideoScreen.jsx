// components/VideoScreen.jsx
import React from 'react';
import Draggable from 'react-draggable';
import UserVideoComponent from './UserVideoComponent';
import styles from './Video.module.scss';

const VideoScreen = ({ state }) => {
  return (
    <div className={styles.screen}>
      <div className={`${styles.videoPosition} ${!state.showSubtitle ? styles.fullHeight : ""}`}>
        {state.mainStreamManager !== null && (
          <div className={styles.videoItem}>
            <UserVideoComponent streamManager={state.mainStreamManager} />
          </div>
        )}
        {state.subscribers.map((sub) => (
          <Draggable key={sub.stream.connection.connectionId}>
            <div className={styles.othervideoItem}>
              <UserVideoComponent streamManager={sub} />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default VideoScreen;