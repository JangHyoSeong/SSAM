import { useRef, useEffect } from 'react';

// UserVideoComponent: 사용자의 비디오 스트림을 표시하는 React 컴포넌트
const UserVideoComponent = ({ streamManager }) => {
  // video 요소에 대한 참조를 생성합니다.
  const videoRef = useRef();

  // streamManager가 변경될 때마다 실행되는 효과
  useEffect(() => {
    // streamManager와 video 요소가 모두 존재하는 경우
    if (streamManager && videoRef.current) {
      // streamManager에 video 요소를 연결합니다.
      // 이를 통해 비디오 스트림이 해당 요소에 표시됩니다.
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]); // streamManager가 변경될 때만 이 효과를 재실행합니다.

  // 비디오를 표시하는 JSX를 반환합니다.
  return (
    <div>
      {/* 
        autoPlay: 비디오가 자동으로 재생되도록 설정
        ref: 생성한 참조를 video 요소에 연결
      */}
      <video autoPlay={true} ref={videoRef} />
    </div>
  );
};

export default UserVideoComponent;