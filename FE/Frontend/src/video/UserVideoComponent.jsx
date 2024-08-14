// components/UserVideoComponent.jsx
import React, { useRef, useEffect } from 'react';

const UserVideoComponent = ({ streamManager }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div>
      <video autoPlay={true} ref={videoRef} />
    </div>
  );
};

export default UserVideoComponent;