// hooks/useVideoChat.js
import { useRef, useCallback } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';

const apiUrl = import.meta.env.API_URL;

export const useVideoChat = (state, updateState, accessCode) => {
  const OV = useRef(new OpenVidu());
  const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`);

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

  const joinSession = useCallback(async () => {
    const mySession = OV.current.initSession();

    mySession.on("streamCreated", (event) => {
      if (event.stream.connection.connectionId !== mySession.connection.connectionId) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        updateState(prevState => ({ subscribers: [...prevState.subscribers, subscriber] }));
      }
    });

    mySession.on("streamDestroyed", (event) => {
      updateState(prevState => ({ subscribers: prevState.subscribers.filter(sub => sub !== event.stream.streamManager) }));
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      const myToken = await getToken();
      await mySession.connect(myToken.token, { clientData: myUserName.current });

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

      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

      const startTime = new Date(myToken.createdAt);
      const formatted = startTime.toLocaleString();
      const endTime = new Date(startTime.getTime() + 20 * 60 * 1000);

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

  const leaveSession = useCallback(async () => {
    if (state.session) {
      try {
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
    updateState({
      session: null,
      subscribers: [],
      mainStreamManager: null,
      publisher: null,
    });
  }, [state, updateState, accessCode]);

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

  const toggleCamera = useCallback(() => {
    if (state.publisher) {
      state.publisher.publishVideo(!state.isCameraOn);
      updateState({ isCameraOn: !state.isCameraOn });
    }
  }, [state, updateState]);

  const toggleMic = useCallback(() => {
    if (state.publisher) {
      state.publisher.publishAudio(!state.isMicOn);
      updateState({ isMicOn: !state.isMicOn });
    }
  }, [state, updateState]);

  return { joinSession, leaveSession, toggleRecording, toggleCamera, toggleMic };
};