import { useRef, useCallback } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';

// 환경 변수에서 API URL을 가져옵니다.
const apiUrl = import.meta.env.API_URL;

// useVideoChat 커스텀 훅: 화상 채팅 기능을 구현하는 훅
export const useVideoChat = (state, updateState, accessCode) => {
  // OpenVidu 객체를 생성하고 useRef로 관리합니다.
  const OV = useRef(new OpenVidu());
  // 랜덤한 사용자 이름을 생성합니다.
  const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`);

  // 토큰을 가져오는 함수
  const getToken = async () => {
    const token = localStorage.getItem("USER_TOKEN");
    try {
      const response = await axios.post(`${apiUrl}/v1/video/token`,
        { accessCode, userId: myUserName.current },
        { headers: { "Content-Type": "application/json", Authorization: token } }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  // 세션에 참가하는 함수
  const joinSession = useCallback(async () => {
    const mySession = OV.current.initSession();

    // 스트림 생성 이벤트 핸들러
    mySession.on("streamCreated", (event) => {
      if (event.stream.connection.connectionId !== mySession.connection.connectionId) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        updateState(prevState => ({ subscribers: [...prevState.subscribers, subscriber] }));
      }
    });

    // 스트림 제거 이벤트 핸들러
    mySession.on("streamDestroyed", (event) => {
      updateState(prevState => ({ subscribers: prevState.subscribers.filter(sub => sub !== event.stream.streamManager) }));
    });

    // 예외 발생 이벤트 핸들러
    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      // 토큰을 가져와 세션에 연결합니다.
      const myToken = await getToken();
      await mySession.connect(myToken.token, { clientData: myUserName.current });

      // 퍼블리셔를 초기화하고 세션에 게시합니다.
      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "16:9",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });
      mySession.publish(publisher);

      // 비디오 장치 정보를 가져옵니다.
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

      // 세션 시작 시간과 종료 시간을 설정합니다.
      const startTime = new Date(myToken.createdAt);
      const formatted = startTime.toLocaleString();
      const endTime = new Date(startTime.getTime() + 20 * 60 * 1000);

      // 남은 시간을 계산하는 인터벌을 설정합니다.
      const intervalId = setInterval(() => {
        const now = new Date();
        const remainingTime = endTime - now;

        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / (60 * 1000));
          const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
          const remainingTimeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          updateState({ remainingTime: remainingTimeString });
        } else {
          clearInterval(intervalId);
          updateState({ isTimerEnded: true });
        }
      }, 1000);

      // 상태를 업데이트합니다.
      updateState({
        session: mySession,
        mainStreamManager: publisher,
        publisher: publisher,
        currentVideoDevice: currentVideoDevice,
        formattedDate: formatted,
      });

    } catch (error) {
      console.log("There was an error connecting to the session:", error.code, error.message);
    }
  }, [updateState, accessCode]);

  // 세션을 떠나는 함수
  const leaveSession = useCallback(async () => {
    if (state.session) {
      try {
        // 토큰을 삭제하고 사용자 역할에 따라 리다이렉트합니다.
        await axios.delete(`${apiUrl}/v1/video/token`, {
          data: { accessCode, userId: myUserName.current },
        });
        const token = localStorage.getItem("USER_TOKEN");
        const response = await axios.get(`${apiUrl}/v1/users/initial`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        const userRole = response.data.role;

        if (userRole === "TEACHER") {
          window.location.replace("/teachersubpage");
        } else if (userRole === "STUDENT") {
          window.location.replace("/studentsubpage");
        }
      } catch (error) {
        console.error("Error during session leave:", error);
      }
      state.session.disconnect();
    }
    // 상태를 초기화합니다.
    updateState({
      session: null,
      subscribers: [],
      mainStreamManager: null,
      publisher: null,
    });
  }, [state, updateState, accessCode]);

  // 녹화를 토글하는 함수
  const toggleRecording = useCallback(async () => {
    if (!state.isRecording) {
      try {
        await axios.post(`${apiUrl}/v1/video/recording/start`, {
          sessionId: state.session.sessionId,
          outputMode: "COMPOSED",
          hasAudio: true,
          hasVideo: true,
        });
        updateState({ isRecording: true });
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await axios.post(`${apiUrl}/v1/video/recording/stop`, {
          sessionId: state.session.sessionId,
        });
        updateState({ isRecording: false });
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  }, [state, updateState]);

  // 카메라를 토글하는 함수
  const toggleCamera = useCallback(() => {
    if (state.publisher) {
      state.publisher.publishVideo(!state.isCameraOn);
      updateState({ isCameraOn: !state.isCameraOn });
    }
  }, [state, updateState]);

  // 마이크를 토글하는 함수
  const toggleMic = useCallback(() => {
    if (state.publisher) {
      state.publisher.publishAudio(!state.isMicOn);
      updateState({ isMicOn: !state.isMicOn });
    }
  }, [state, updateState]);

  return { joinSession, leaveSession, toggleRecording, toggleCamera, toggleMic };
};