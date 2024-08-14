import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import styles from "./Video.module.scss";

const API_BASE_URL = "http://localhost:8081/v1/video";

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
      const token = localStorage.getItem("USER_TOKEN");
      try {
        console.log("Fetching profile data with token:", token);
        const response = await axios.get(`${apiUrl}/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
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

  // 세션을 떠나는 함수
  const leaveSession = async () => {
    if (session) {
      try {
        await axios.delete(`${API_BASE_URL}/token`, {
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
        const response = await axios.post(`${API_BASE_URL}/recording/start`, {
          accessCode: accessCode,
          outputMode: "COMPOSED",
          hasAudio: true,
          hasVideo: true,
        });
        setRecordingId(response.data.id);
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      try {
        await axios.post(`${API_BASE_URL}/recording/stop`, {
          recordingId: recordingId,
        });
        setIsRecording(false);
        setRecordingId(null);
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
        from: profileData.name, // .current 대신 .name 사용
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
    const token = localStorage.getItem("USER_TOKEN");
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
            Authorization: token,
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

  return (
    <div className={styles.videoArray}>
      {session === null ? (
        <div className="join-container d-flex align-items-center justify-content-center vh-100">
          <div className="join-form-container bg-light p-5 rounded shadow">
            <h2 className="text-center mb-4">Joining session...</h2>
          </div>
        </div>
      ) : (
        <div className={styles.top}>
          <div className={styles.menubarArray}>
            <div className={styles.menubar}>
              <h3 className="m-0">Session: {sessionId}</h3>
              <div>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={switchCamera}
                >
                  Switch Camera
                </button>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={toggleRecording}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={toggleCamera}
                >
                  {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                </button>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={toggleMic}
                >
                  {isMicOn ? "Turn Off Mic" : "Turn On Mic"}
                </button>
                <button className="btn btn-danger" onClick={leaveSession}>
                  Leave Session
                </button>
              </div>
            </div>
          </div>

          <div className={styles.timeArray}>
            <div className={styles.time}>
              <h1>04 : 49</h1>
            </div>
          </div>

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
                  className={styles.videoItem}
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
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
                            {msg.connectionId ===
                            session.connection.connectionId
                              ? profileData.name == ""
                                ? "익명"
                                : profileData.name
                              : "상대방"}{" "}
                            :{" "}
                          </strong>
                          {msg.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              <div>
                <input
                  type="text"
                  value={chatInput}
                  className={styles.chatForm}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Type a message..."
                />
                <button className={styles.chatSend} onClick={sendChatMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 유저 비디오 컴포넌트
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
