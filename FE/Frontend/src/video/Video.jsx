// Video.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideoChat } from './useVideoChat';
import { useSTT } from './useSTT';
import { useProfile } from './useProfile';
import MenuBar from './MenuBar';
import VideoScreen from './VideoScreen';
import ChatBox from './ChatBox';
import SubtitleBox from './SubtitleBox';
import styles from './Video.module.scss';

const Video = () => {
  const { accessCode } = useParams();
  const [state, setState] = useState({
    session: null,
    mainStreamManager: null,
    publisher: null,
    subscribers: [],
    chatMessages: [],
    sttMessages: [],
    isRecording: false,
    isCameraOn: true,
    isMicOn: true,
    showSubtitle: true,
    formattedDate: '',
    remainingTime: '',
    isTimerEnded: false,
    profanityDetected: false
  });

  const updateState = (newState) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  const { joinSession, leaveSession, toggleRecording, toggleCamera, toggleMic } = useVideoChat(state, updateState, accessCode);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSTT(state, updateState);
  const { profileData } = useProfile();

  useEffect(() => {
    joinSession();
    return () => leaveSession();
  }, []);

  if (state.session === null) {
    return <h1 className={styles.entering}>화상상담 입장 중...</h1>;
  }

  return (
    <div className={styles.videoArray}>
      {state.profanityDetected && (
        <div className={styles.profanityOverlay}>
          <h1>부적절한 언어가 감지되었습니다</h1>
        </div>
      )}
      <MenuBar
        state={state}
        toggleRecording={toggleRecording}
        toggleCamera={toggleCamera}
        toggleMic={toggleMic}
        leaveSession={leaveSession}
        updateState={updateState}
      />
      <div className={styles.bottom}>
        <VideoScreen state={state} />
        {state.showSubtitle && <SubtitleBox sttMessages={state.sttMessages} profileData={profileData} />}
        <ChatBox state={state} updateState={updateState} profileData={profileData} />
      </div>
    </div>
  );
};

export default Video;
