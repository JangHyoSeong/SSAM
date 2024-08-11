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
  const { accessCode } = useParams(); // URL 파라미터에서 accessCode 가져오기
  const [sessionId, setSessionId] = useState(null); // 세션 ID 상태 변수
  const [session, setSession] = useState(null); // OpenVidu 세션 객체 상태 변수
  const [mainStreamManager, setMainStreamManager] = useState(null); // 메인 스트림 관리자 상태 변수
  const [publisher, setPublisher] = useState(null); // 퍼블리셔 상태 변수
  const [subscribers, setSubscribers] = useState([]); // 구독자 리스트 상태 변수
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null); // 현재 비디오 장치 상태 변수
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 상태 변수
  const [chatInput, setChatInput] = useState(""); // 채팅 입력 상태 변수
  const [isRecording, setIsRecording] = useState(false); // 녹화 여부 상태 변수
  const [recordingId, setRecordingId] = useState(null); // 녹화 ID 상태 변수
  const [isCameraOn, setIsCameraOn] = useState(true); // 카메라 상태 변수
  const [isMicOn, setIsMicOn] = useState(true); // 마이크 상태 변수
  const [time, setTime] = useState({ minutes: 0, seconds: 0 }); // 타이머 상태 변수
  const OV = useRef(new OpenVidu()); // OpenVidu 객체 참조
  const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`); // 임의의 사용자 이름 생성

  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload); // 창이 닫히기 전 이벤트 리스너 등록
    joinSession(); // 세션 참여

    // 타이머 설정
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
      window.removeEventListener("beforeunload", onBeforeUnload); // 이벤트 리스너 제거
      leaveSession(); // 세션 종료
      clearInterval(timerInterval); // 타이머 정리
    };
  }, []);

  const onBeforeUnload = () => {
    leaveSession(); // 창이 닫히기 전 세션 종료
  };

  const joinSession = async () => {
    const mySession = OV.current.initSession(); // 세션 초기화

    // 새로운 스트림이 생성되었을 때 처리
    mySession.on("streamCreated", (event) => {
      if (
        event.stream.connection.connectionId !==
        mySession.connection.connectionId
      ) {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers((subscribers) => [...subscribers, subscriber]);
      }
    });

    // 스트림이 파괴되었을 때 처리
    mySession.on("streamDestroyed", (event) => {
      setSubscribers((subscribers) =>
        subscribers.filter((sub) => sub !== event.stream.streamManager)
      );
    });

    // 예외 처리
    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    try {
      const token = await getToken(); // 토큰 가져오기
      await mySession.connect(token, { clientData: myUserName.current }); // 세션에 연결

      setSessionId(mySession.sessionId); // 세션 ID 설정
      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "480x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });
      mySession.publish(publisher); // 퍼블리셔 공개

      const devices = await OV.current.getDevices(); // 장치 목록 가져오기
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
      setSession(mySession); // 세션 설정
      setMainStreamManager(publisher); // 메인 스트림 관리자 설정
      setPublisher(publisher); // 퍼블리셔 설정
      setCurrentVideoDevice(currentVideoDevice); // 현재 비디오 장치 설정
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
      session.disconnect(); // 세션 연결 종료
    }
    setSession(null); // 세션 상태 초기화
    setSubscribers([]); // 구독자 리스트 초기화
    setMainStreamManager(null); // 메인 스트림 관리자 초기화
    setPublisher(null); // 퍼블리셔 초기화
  };

  const switchCamera = async () => {
    try {
      const devices = await OV.current.getDevices(); // 장치 목록 가져오기
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

          await session.unpublish(mainStreamManager); // 기존 스트림 발행 중지
          await session.publish(newPublisher); // 새로운 스트림 발행
          setCurrentVideoDevice(newVideoDevice[0]); // 새로운 비디오 장치 설정
          setMainStreamManager(newPublisher); // 새로운 메인 스트림 관리자 설정
          setPublisher(newPublisher); // 새로운 퍼블리셔 설정
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
            sessionId: session.sessionId,
            outputMode: "COMPOSED",
            hasAudio: true,
            hasVideo: true,
          }
        );
        setRecordingId(response.data.id); // 녹화 ID 설정
        setIsRecording(true); // 녹화 상태 설정
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await axios.post(`${apiUrl}/v1/video/recording/stop`, {
          sessionId: session.sessionId,
        });
        setIsRecording(false); // 녹화 상태 해제
        setRecordingId(null); // 녹화 ID 초기화
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  // const toggleCamera = () => {
  //   if (publisher) {
  //     publisher.publishVideo(!isCameraOn); // 카메라 상태 전환
  //     setIsCameraOn(!isCameraOn); // 카메라 상태 업데이트
  //   }
  // };

  const toggleCamera = () => {
    setIsCameraOn((prevIsCameraOn) => {
      const newIsCameraOn = !prevIsCameraOn;
      if (publisher) {
        publisher.publishVideo(newIsCameraOn);
      }
      return newIsCameraOn;
    });
  };

  const toggleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMicOn); // 마이크 상태 전환
      setIsMicOn(!isMicOn); // 마이크 상태 업데이트
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
      setChatMessages((prevMessages) => [...prevMessages, messageData]); // 채팅 메시지 리스트 업데이트
      setChatInput(""); // 채팅 입력 초기화
    }
  };

  useEffect(() => {
    if (session) {
      session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        if (data.connectionId !== session.connection.connectionId) {
          setChatMessages((prevMessages) => [...prevMessages, data]); // 다른 사용자의 채팅 메시지 수신
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
      return response.data.token; // 토큰 반환
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  // 오늘 날짜 불러오기
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${String(
    today.getMonth() + 1
  ).padStart(2, "0")}월 ${String(today.getDate()).padStart(2, "0")}일`;

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
                <p>{formattedDate}</p>
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
                <button className={styles.leaveSession} onClick={leaveSession}>
                  <h1>X</h1>
                </button>
              </div>
            </div>
          </div>

          {/* 시간 */}
          <div className={styles.timeArray}>
            <div className={styles.time}>
              <h1>{`${String(time.minutes).padStart(2, "0")}:${String(
                time.seconds
              ).padStart(2, "0")}`}</h1>
            </div>
          </div>

          {/* 화면 */}
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
