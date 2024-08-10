import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import styles from "./Video.module.scss";
import whitelogo from "../assets/whitelogo.png";
import REC from "../assets/REC.png";
import Conversion from "../assets/Conversion.png";
import mikeOn from "../assets/mikeOn.png";
import mikeOff from "../assets/mikeOff.png";
import cameraOn from "../assets/cameraOn.png";
import cameraOff from "../assets/cameraOff.png";

const apiUrl = import.meta.env.API_URL;

const VideoChatComponent = () => {
  const { accessCode } = useParams();
  const [sessionId, setSessionId] = useState(null);
  const [session, setSession] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingId, setRecordingId] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isRECOn, setIsRECOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [time, setTime] = useState({ minutes: 0, seconds: 0 }); // State for time
  const OV = useRef(new OpenVidu());

  const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`);

  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    joinSession();

    const timerInterval = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds + 1;
        const newMinutes =
          newSeconds >= 60 ? prevTime.minutes + 1 : prevTime.minutes;
        return {
          minutes: newMinutes,
          seconds: newSeconds >= 60 ? 0 : newSeconds,
        };
      });
    }, 1000);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      leaveSession();
      clearInterval(timerInterval);
    };
  }, []);

  const onBeforeUnload = () => {
    leaveSession();
  };

  const joinSession = async () => {
    const mySession = OV.current.initSession();

    mySession.on("streamCreated", (event) => {
      if (
        event.stream.connection.connectionId !==
        mySession.connection.connectionId
      ) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((subscribers) => [...subscribers, subscriber]);
      }
    });

    mySession.on("streamDestroyed", (event) => {
      setSubscribers((subscribers) =>
        subscribers.filter((sub) => sub !== event.stream.streamManager)
      );
    });

    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      const token = await getToken();
      await mySession.connect(token, { clientData: myUserName.current });

      setSessionId(mySession.sessionId);
      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });
      mySession.publish(publisher);

      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const currentVideoDeviceId = publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );
      setSession(mySession);
      setMainStreamManager(publisher);
      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);
    } catch (error) {
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  };

  const leaveSession = async () => {
    if (session) {
      try {
        await axios.delete(`${apiUrl}/v1/video/token`, {
          data: {
            accessCode: accessCode,
            userId: myUserName.current,
          },
        });
      } catch (error) {
        console.error("Error deleting token:", error);
      }
      session.disconnect();
    }
    setSession(null);
    setSubscribers([]);
    setMainStreamManager(null);
    setPublisher(null);
  };

  const switchCamera = async () => {
    try {
      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: false,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);
          setCurrentVideoDevice(newVideoDevice[0]);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const response = await axios.post(
          `${apiUrl}/v1/video/recording/start`,
          {
            accessCode: accessCode,
            outputMode: "COMPOSED",
            hasAudio: true,
            hasVideo: true,
          }
        );
        setRecordingId(response.data.id);
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await axios.post(`${apiUrl}/v1/video/recording/stop`, {
          recordingId: recordingId,
        });
        setIsRecording(false);
        setRecordingId(null);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const toggleCamera = () => {
    if (publisher) {
      publisher.publishVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const sendChatMessage = () => {
    if (chatInput.trim() !== "" && session) {
      const messageData = {
        message: chatInput,
        from: myUserName.current,
        connectionId: session.connection.connectionId,
      };
      session.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      setChatMessages((prevMessages) => [...prevMessages, messageData]);
      setChatInput("");
    }
  };

  useEffect(() => {
    if (session) {
      session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        if (data.connectionId !== session.connection.connectionId) {
          setChatMessages((prevMessages) => [...prevMessages, data]);
        }
      });
    }
  }, [session]);

  const getToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}/v1/video/token`, {
        accessCode: accessCode,
        userId: myUserName.current,
      });
      return response.data.token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  return (
    <div className={styles.videoArray}>
      {session === null ? (
        <h1 className={styles.entering}>화상상담 입장 중...</h1>
      ) : (
        <div className={styles.top}>
          <div className={styles.menubarArray}>
            <div className={styles.menubar}>
              <div className={styles.logoArray}>
                <img src={whitelogo} className={styles.logo} alt="Logo" />
              </div>
              {/* <h3>Session: {sessionId}</h3> */}
              <div className={styles.dayArray}>
                <p>2024년 8월 10일</p>
              </div>
              <div className={styles.iconArray}>
                {/* 녹화 버튼 */}
                <button onClick={toggleRecording}>
                  {isRECOn ? (
                    <img src={REC} className={styles.imgIcon} />
                  ) : (
                    "Off REC"
                  )}
                </button>

                {/* 화면 전환 버튼 */}
                <img
                  src={Conversion}
                  className={styles.imgIcon}
                  onClick={switchCamera}
                />

                {/* 카메라 ON / Off 버튼 */}
                <button onClick={toggleCamera}>
                  {isCameraOn ? (
                    <img src={cameraOn} className={styles.imgIcon} />
                  ) : (
                    "On Camera"
                  )}
                </button>

                {/* 마이크 ON / Off 버튼 */}
                <button onClick={toggleMic}>
                  {isMicOn ? (
                    <img src={mikeOn} className={styles.imgIcon} />
                  ) : (
                    "On Mic"
                  )}
                </button>

                {/* 나가기 버튼 */}
                <button className={styles.leaveSession} onClick={leaveSession}>
                  <h1>X</h1>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.timeArray}>
            <div className={styles.time}>
              <h1>{`${String(time.minutes).padStart(2, "0")}:${String(
                time.seconds
              ).padStart(2, "0")}`}</h1>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.screen}>
              {mainStreamManager !== null && (
                <div className={styles.youvideoItem}>
                  <UserVideoComponent streamManager={mainStreamManager} />
                </div>
              )}
              {subscribers.map((sub) => (
                <div
                  key={sub.stream.connection.connectionId}
                  className={styles.myvideoItem}
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>

            <div className={styles.subTitleArray}>
              <div className={styles.subTitle}></div>
            </div>

            <div className={styles.chatingArray}>
              <div className={styles.chating}>
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chatMessage ${
                      msg.connectionId === session.connection.connectionId
                        ? "ownMessage"
                        : "otherMessage"
                    }`}
                  >
                    <strong>{msg.from}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <div className={styles.chatInputArray}>
                <input
                  type="text"
                  value={chatInput}
                  className={styles.chatForm}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="채팅을 입력해주세요"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

export default VideoChatComponent;
