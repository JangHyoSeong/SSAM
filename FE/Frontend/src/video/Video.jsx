import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import styles from "./Video.module.scss";
import whitelogo from "../assets/whitelogo.png";
import RECOn from "../assets/RECOn.png";
import RECOff from "../assets/RECOff.png";
import Conversion from "../assets/Conversion.png";
import mikeOn from "../assets/mikeOn.png";
import mikeOff from "../assets/mikeOff.png";
import cameraOn from "../assets/cameraOn.png";
import cameraOff from "../assets/cameraOff.png";

const apiUrl = import.meta.env.API_URL;

const VideoChatComponent = () => {
  const { accessCode } = useParams();
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");
  // const [timesub, setTimeSub] = useState("");
  const OV = useRef(new OpenVidu());
  const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTimeSub(new Date());
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // 컴포넌트가 마운트 될 때와 언마운트 될 때 이벤트 리스너 추가 및 제거
  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    joinSession();

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      leaveSession();
    };
  }, []);

  // 페이지를 떠나기 전 세션을 떠나는 함수
  const onBeforeUnload = () => {
    leaveSession();
  };

  // 세션에 참가하는 함수
  const joinSession = async () => {
    const mySession = OV.current.initSession();

    // 새로운 스트림이 생성될 때 이벤트 리스너
    mySession.on("streamCreated", (event) => {
      if (
        event.stream.connection.connectionId !==
        mySession.connection.connectionId
      ) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((subscribers) => [...subscribers, subscriber]);
      }
    });

    // 스트림이 파괴될 때 이벤트 리스너
    mySession.on("streamDestroyed", (event) => {
      setSubscribers((subscribers) =>
        subscribers.filter((sub) => sub !== event.stream.streamManager)
      );
    });

    // 예외가 발생할 때 이벤트 리스너
    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      const myToken = await getToken();
      await mySession.connect(myToken.token, {
        clientData: myUserName.current,
      });

      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "1280x660",
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
      setToken(myToken);
      setSession(mySession);
      setMainStreamManager(publisher);
      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);

      // 현재 시간
      const nowdate = new Date().toLocaleString();
      setTimeSub(nowdate);

      // 날짜, 시간 들고오기
      if (myToken && myToken.createdAt) {
        const formatted = new Date(myToken.createdAt).toLocaleString();
        setFormattedDate(formatted);
      } else {
        console.warn("Token or createdAt is undefined");
      }
    } catch (error) {
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  };

  // 세션을 떠나는 함수
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

  // 카메라를 전환하는 함수
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

  // 녹화를 시작/중지하는 함수
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const response = await axios.post(
          `${apiUrl}/v1/video/recording/start`,
          {
            sessionId: session.sessionId,
            outputMode: "COMPOSED",
            hasAudio: true,
            hasVideo: true,
          }
        );
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await axios.post(`${apiUrl}/v1/video/recording/stop`, {
          sessionId: session.sessionId,
        });
        setIsRecording(false);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  // 카메라를 켜고 끄는 함수
  const toggleCamera = () => {
    if (publisher) {
      publisher.publishVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  // 마이크를 켜고 끄는 함수
  const toggleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  // 채팅 메시지를 보내는 함수
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

  // 세션이 변경될 때 채팅 메시지를 수신하는 이벤트 리스너 추가
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

  // 토큰을 가져오는 함수
  const getToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}/v1/video/token`, {
        accessCode: accessCode,
        userId: myUserName.current,
      });
      return response.data;
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

              {/* 날짜, 시간 */}
              <div className={styles.dayArray}>
                <p>{formattedDate}</p>
                {/* {timesub.toLocaleTimeString()} */}
              </div>

              <div className={styles.iconArray}>
                {/* 녹화 버튼 */}
                <button className={styles.btnIcon} onClick={toggleRecording}>
                  {isRecording ? (
                    <img src={RECOn} className={styles.imgIcon} />
                  ) : (
                    <img src={RECOff} className={styles.imgIcon} />
                  )}
                </button>

                {/* 화면 전환 버튼 */}
                <button className={styles.btnIcon} onClick={switchCamera}>
                  <img
                    src={Conversion}
                    className={styles.imgIcon}
                    onClick={switchCamera}
                  />
                </button>

                {/* 카메라 ON / Off 버튼 */}
                <button className={styles.btnIcon} onClick={toggleCamera}>
                  {isCameraOn ? (
                    <img src={cameraOn} className={styles.imgIcon} />
                  ) : (
                    <img src={cameraOff} className={styles.imgIcon} />
                  )}
                </button>

                {/* 마이크 ON / Off 버튼 */}
                <button className={styles.btnIcon} onClick={toggleMic}>
                  {isMicOn ? (
                    <img src={mikeOn} className={styles.imgIcon} />
                  ) : (
                    <img src={mikeOff} className={styles.imgIcon} />
                  )}
                </button>

                {/* 나가기 버튼 */}
                <button
                  className={`${styles.leaveSession} ${styles.btnIcon}`}
                  onClick={leaveSession}
                >
                  <h1>X</h1>
                </button>
              </div>
            </div>
          </div>

          {/* 시간 */}
          <div className={styles.timeArray}>
            <div className={styles.time}></div>
          </div>

          {/* 화면 */}
          <div className={styles.bottom}>
            <div className={styles.screen}>
              {mainStreamManager !== null && (
                <div className={styles.videoItem}>
                  <UserVideoComponent streamManager={mainStreamManager} />
                </div>
              )}
              {subscribers.map((sub) => (
                <div
                  key={sub.stream.connection.connectionId}
                  className={styles.othervideoItem}
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>

            {/* 자막 */}
            <div className={styles.subTitleArray}>
              <div className={styles.subTitle}></div>
            </div>

            {/* 채팅 */}
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
