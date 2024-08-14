import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import styles from "./Video.module.scss";
import whitelogo from "../assets/whitelogo.png";
import RECOn from "../assets/RECOn.png";
import RECOff from "../assets/RECOff.png";
import mikeOn from "../assets/mikeOn.png";
import mikeOff from "../assets/mikeOff.png";
import cameraOn from "../assets/cameraOn.png";
import cameraOff from "../assets/cameraOff.png";
import subtitleOn from "../assets/subtitleOn.png";
import subtitleOff from "../assets/subtitleOff.png";
import Draggable from "react-draggable";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const apiUrl = import.meta.env.API_URL;
const VideoChatComponent = () => {
  const { accessCode } = useParams(); // URL에서 accessCode를 가져옴
  const [session, setSession] = useState(null); // 세션 상태 관리
  const [token, setToken] = useState(null); // 토큰 상태 관리
  const [mainStreamManager, setMainStreamManager] = useState(null); // 주 스트림 관리
  const [publisher, setPublisher] = useState(null); // 발행자 관리
  const [subscribers, setSubscribers] = useState([]); // 구독자 관리
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null); // 현재 비디오 장치 관리
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 관리
  const [chatInput, setChatInput] = useState(""); // 채팅 입력 관리
  const [isRecording, setIsRecording] = useState(false); // 녹화 상태 관리
  const [isCameraOn, setIsCameraOn] = useState(true); // 카메라 상태 관리
  const [isMicOn, setIsMicOn] = useState(true); // 마이크 상태 관리
  const [sttMessages, setSTTMessages] = useState([]); // 음성 인식 메시지 관리
  // const [tmpMessage, setTmpMessage] = useState(""); // 임시 메시지 관리
  const OV = useRef(new OpenVidu()); // OpenVidu 인스턴스 생성
  const myUserName = useRef(`user_${Math.floor(Math.random() * 1000) + 1}`); // 사용자 이름 생성
  const chatContainerRef = useRef(null); // 채팅 컨테이너 참조
  const subtitleRef = useRef(null); // 자막 컨테이너 참조
  const lastTranscriptRef = useRef(""); // 마지막 음성 인식 결과 참조
  const timeoutRef = useRef(null); // 타임아웃 참조
  const [formattedDate, setFormattedDate] = useState(""); // 포맷된 날짜 관리
  const [profileData, setProfileData] = useState({ name: "" }); // 프로필 데이터 관리
  const [showSubtitle, setShowSubtitle] = useState(true); // subtitle 표시 여부를 관리하는 상태 변수
  const [remainingTime, setRemainingTime] = useState(""); // 남은 시간을 관리하는 상태 변수
  const [isTimerEnded, setIsTimerEnded] = useState(false); // 타이머 종료 여부를 관리하는 상태 변수
  const [profanityDetected, setProfanityDetected] = useState(false); // 필터링
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const toggleSubTitle = () => {
    setShowSubtitle(!showSubtitle);
  };

  useEffect(() => {
    // 사용자 이름 GET
    const fetchData = async () => {
      const userToken = localStorage.getItem("USER_TOKEN");
      try {
        console.log("Fetching profile data with token:", token);
        const response = await axios.get(`${apiUrl}/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${userToken}`,
          },
        });
        const data = {
          name: response.data.name || "",
        };
        setProfileData(data);
        console.log("가져온 프로필 데이터 : ", data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (transcript !== lastTranscriptRef.current) {
      // setTmpMessage(transcript); // 음성 인식 메시지 상태 업데이트
      lastTranscriptRef.current = transcript;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // 기존 타임아웃 초기화
      }

      timeoutRef.current = setTimeout(() => {
        if (
          transcript === lastTranscriptRef.current &&
          transcript.trim() !== ""
        ) {
          sendSTTMessage(transcript); // 음성 인식 메시지를 전송
          resetTranscript(); // 음성 인식 상태 초기화
        }
      }, 1000);
    }
  }, [transcript]);

  useEffect(() => {
    // 페이지를 떠날 때 이벤트 리스너 추가
    window.addEventListener("beforeunload", onBeforeUnload);
    joinSession(); // 세션에 참가

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      leaveSession(); // 세션을 떠남
      SpeechRecognition.stopListening(); // 음성 인식 중지
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // 타임아웃 정리
      }
    };
  }, []);

  useEffect(() => {
    if (session && isMicOn) {
      // 마이크가 켜져 있을 때 음성 인식 시작
      SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    } else {
      // 마이크가 꺼져 있을 때 음성 인식 중지
      SpeechRecognition.stopListening();
    }
  }, [session, isMicOn]);

  useEffect(() => {
    if (subtitleRef.current) {
      // 새로운 자막 메시지가 추가되면 자막 컨테이너 스크롤을 아래로 이동
      subtitleRef.current.scrollTop = subtitleRef.current.scrollHeight;
    }
  }, [sttMessages]);

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
        // resolution: "960x400",
        resolution: "16:9",
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
      setToken(myToken); // 토큰 상태 설정
      setSession(mySession); // 세션 상태 설정
      setMainStreamManager(publisher); // 주 스트림 설정
      setPublisher(publisher); // 발행자 설정
      setCurrentVideoDevice(currentVideoDevice); // 현재 비디오 장치 설정

      // 날짜, 시간 들고오기
      if (myToken && myToken.createdAt) {
        const startTime = new Date(myToken.createdAt);
        const formatted = startTime.toLocaleString();
        setFormattedDate(formatted);

        // 시작 시간으로부터 20분 후의 종료 시간 계산
        const endTime = new Date(startTime.getTime() + 20 * 60 * 1000);

        const intervalId = setInterval(() => {
          const now = new Date();
          const remainingTime = endTime - now;

          if (remainingTime > 0) {
            const minutes = Math.floor(remainingTime / (60 * 1000));
            const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
            const remainingTimeString = `${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            setRemainingTime(remainingTimeString);
          } else {
            clearInterval(intervalId);
            setIsTimerEnded(true);
          }
        }, 1000);

        // 컴포넌트가 언마운트될 때 인터벌을 정리
        return () => clearInterval(intervalId);
      } // 1초마다 업데이트
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
      window.location.replace("/"); // 선생님과 학생을 각각 이동시키도록 수정해야함
      session.disconnect();
    }
    setSession(null);
    setSubscribers([]);
    setMainStreamManager(null);
    setPublisher(null);
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
      if (!isMicOn) {
        SpeechRecognition.startListening({
          continuous: true,
          language: "ko-KR",
        });
      } else {
        SpeechRecognition.stopListening();
        resetTranscript();
        // setTmpMessage("");
        lastTranscriptRef.current = "";
      }
    }
  };

  // 채팅 메시지를 보내는 함수
  const sendChatMessage = () => {
    if (chatInput.trim() !== "" && session) {
      const messageData = {
        message: chatInput,
        from: token.userId, // .current 대신 .name 사용
        connectionId: session.connection.connectionId,
      };
      session.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      setChatInput("");
    }
  };

  // 세션이 변경될 때 채팅 메시지를 수신하는 이벤트 리스너 추가
  useEffect(() => {
    if (session) {
      session.on("signal:chat", (event) => {
        const data = JSON.parse(event.data);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            from:
              data.connectionId === session.connection.connectionId
                ? data.from // 본인 메시지의 경우 원래 이름 유지
                : "상대방", // 다른 사람의 메시지는 '상대방'으로 표시
          },
        ]);
      });
    }
  }, [session]);

  const sendSTTMessage = async (text) => {
    if (text.trim() !== "" && session) {
      const messageData = {
        message: text,
        from: myUserName.current,
        connectionId: session.connection.connectionId,
      };
      // 욕설 감지 API 호출 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
      try {
        const response = await axios.post(`${apiUrl}/v1/profanity/check`, {
          message: text,
        });
        console.warn(response.data);
        let consecutiveOffensiveCount = 0;

        if (response.data.category === "공격발언") {
          consecutiveOffensiveCount = 1;
          console.warn("공격발언이 1회 감지되었습니다");
        }

        setSTTMessages((prevMessages) => {
          const newMessages = [...prevMessages, messageData];
          const lastFiveMessages = newMessages.slice(-5); // 최대 5개의 메시지만 유지

          // 이전 상태의 마지막 메시지 (있다면) 확인
          if (
            prevMessages.length > 0 &&
            prevMessages[prevMessages.length - 1].category === "공격발언"
          ) {
            consecutiveOffensiveCount++;
            console.warn("공격발언이 2회 감지되었습니다");
          }

          // 두 개 이상의 연속된 공격적 메시지가 감지되면
          if (consecutiveOffensiveCount >= 2) {
            setProfanityDetected(true);
            // 1초 후에 빨간 박스를 제거합니다.
            setTimeout(() => setProfanityDetected(false), 1000);
            console.warn("연속된 공격발언이 감지되었습니다");
          }

          return lastFiveMessages;
        });

        session.signal({
          data: JSON.stringify(messageData),
          type: "stt",
        });
      } catch (error) {
        console.error("비속어 확인 중 오류 발생:", error);
      }
    }
  };

  // 토큰을 가져오는 함수
  const getToken = async () => {
    const userToken = localStorage.getItem("USER_TOKEN");
    try {
      const response = await axios.post(
        `${apiUrl}/v1/video/token`,
        {
          accessCode: accessCode,
          userId: myUserName.current,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: userToken,
          },
        }
      );
      console.warn(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition.");
  }

  return (
    <div className={styles.videoArray}>
      {session === null ? (
        <h1 className={styles.entering}>화상상담 입장 중...</h1>
      ) : (
        <div className={styles.videoChatContainer}>
          {profanityDetected && (
            <div className={styles.profanityOverlay}>
              <h1>부적절한 언어가 감지되었습니다</h1>
            </div>
          )}
          <div className={styles.menubarArray}>
            <div className={styles.top}>
              <div className={styles.menubar}>
                <div className={styles.logoArray}>
                  <img src={whitelogo} className={styles.logo} alt="Logo" />
                </div>
                {/* <h3>Session: {sessionId}</h3> */}

                {/* 날짜, 시간 */}
                <div className={styles.dayArray}>
                  <p>{formattedDate.slice(0, 11)}</p>
                </div>

                <div className={styles.iconArray}>
                  {/* 녹화 버튼 */}
                  <button className={styles.btnIcon} onClick={toggleRecording}>
                    {isRecording ? (
                      <img
                        src={RECOn}
                        className={styles.imgIcon}
                        alt="Recording On"
                      />
                    ) : (
                      <img
                        src={RECOff}
                        className={styles.imgIcon}
                        alt="Recording Off"
                      />
                    )}
                  </button>

                  {/* 자막 On / Off */}
                  <button className={styles.btnIcon} onClick={toggleSubTitle}>
                    {showSubtitle ? (
                      <img
                        src={subtitleOff}
                        className={styles.imgIcon}
                        alt="subtitleOff"
                      />
                    ) : (
                      <img
                        src={subtitleOn}
                        className={styles.imgIcon}
                        alt="subtitleOn"
                      />
                    )}
                  </button>

                  {/* 카메라 ON / Off 버튼 */}
                  <button className={styles.btnIcon} onClick={toggleCamera}>
                    {isCameraOn ? (
                      <img
                        src={cameraOn}
                        className={styles.imgIcon}
                        alt="Camera On"
                      />
                    ) : (
                      <img
                        src={cameraOff}
                        className={styles.imgIcon}
                        alt="Camera Off"
                      />
                    )}
                  </button>

                  {/* 마이크 ON / Off 버튼 */}
                  <button className={styles.btnIcon} onClick={toggleMic}>
                    {isMicOn ? (
                      <img
                        src={mikeOn}
                        className={styles.imgIcon}
                        alt="Microphone On"
                      />
                    ) : (
                      <img
                        src={mikeOff}
                        className={styles.imgIcon}
                        alt="Microphone Off"
                      />
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
              <div className={styles.time}>
                <p>시작 시간 : {formattedDate.slice(13, 20)}</p>
                {!isTimerEnded ? (
                  <p>남은 시간 : {remainingTime}</p>
                ) : (
                  <p>상담 시간 종료</p>
                )}
              </div>
            </div>
          </div>

          {/* 화면 */}
          <div className={styles.bottom}>
            <div className={styles.screen}>
              <div
                className={`${styles.videoPosition} ${
                  !showSubtitle ? styles.fullHeight : ""
                }`}
              >
                {mainStreamManager !== null && (
                  <div className={styles.videoItem}>
                    <UserVideoComponent streamManager={mainStreamManager} />
                  </div>
                )}
                {subscribers.map((sub) => (
                  <Draggable key={sub.stream.connection.connectionId}>
                    <div className={styles.othervideoItem}>
                      <UserVideoComponent streamManager={sub} />
                    </div>
                  </Draggable>
                ))}
              </div>

              {/* 자막 */}
              <div>
                {showSubtitle && (
                  <div className={styles.subTitleArray}>
                    <div className={styles.subTitle}>
                      {sttMessages.map((msg, index) => (
                        <div key={index}>
                          <strong>
                            {msg.from}: 
                          </strong>
                          {msg.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 채팅 */}
            <div className={styles.right}>
              <div className={styles.chatingArray}>
                <div className={styles.chatContainer}>
                  <div className={styles.chating} ref={chatContainerRef}>
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`${styles.chatMessage} ${
                          msg.connectionId === session.connection.connectionId
                            ? styles.ownMessage
                            : styles.otherMessage
                        }`}
                      >
                        <strong>
                          {msg.connectionId === session.connection.connectionId
                            ? profileData.name
                            : "상대방"}{" "}
                          :{" "}
                        </strong>
                        {msg.message}
                      </div>
                    ))}
                  </div>
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
