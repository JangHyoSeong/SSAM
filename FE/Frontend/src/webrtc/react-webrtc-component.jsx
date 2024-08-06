import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

const API_BASE_URL = 'http://localhost:8081/v1/video'; // Spring 백엔드 API 기본 URL

const VideoChatComponent = () => {
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState(`Participant${Math.floor(Math.random() * 100)}`);
  const [session, setSession] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const OV = useRef(new OpenVidu());

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  const onBeforeUnload = () => {
    leaveSession();
  };

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const joinSession = async () => {
    const mySession = OV.current.initSession();
    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers((subscribers) => [...subscribers, subscriber]);
    });

    mySession.on('streamDestroyed', (event) => {
      setSubscribers((subscribers) =>
        subscribers.filter((sub) => sub !== event.stream.streamManager)
      );
    });

    mySession.on('exception', (exception) => {
      console.warn(exception);
    });

    try {
      const token = await getToken();
      await mySession.connect(token, { clientData: myUserName });

      let publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });

      mySession.publish(publisher);

      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);
      //console.warn(session.connection.connectionId);
      setSession(mySession);
      setMainStreamManager(publisher);
      setPublisher(publisher);
      setCurrentVideoDevice(currentVideoDevice);
    } catch (error) {
      console.log('There was an error connecting to the session:', error.code, error.message);
    }
  };

  const leaveSession = async () => {
    if (session) {
      try {
        await axios.delete(`${API_BASE_URL}/token`, {
          data: { sessionId: mySessionId, userId: myUserName, token: session.token }
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
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(device => device.deviceId !== currentVideoDevice.deviceId);

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: false
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

  const sendChatMessage = () => {
    if (chatInput.trim() !== '' && session) {
      const messageData = {
        message: chatInput,
        from: myUserName,
      };
      session.signal({
        data: JSON.stringify(messageData),
        type: 'chat',
      });
      setChatMessages((prevMessages) => [...prevMessages, messageData]);
      setChatInput('');
    }
  };

  useEffect(() => {
    if (session) {
      session.on('signal:chat', (event) => {
        const data = JSON.parse(event.data);
        //console.warn(session.connection.connectionId);
        console.warn(myUserName);
        console.warn(data.from);
        if(data.from != session.connection.connectionId){
            setChatMessages((prevMessages) => [...prevMessages, data]);
        }
      });
    }
  }, [session]);

  const getToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/token`, {
        sessionId: mySessionId,
        userId: myUserName
      });
      return response.data.token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  return (
    <div className="container">
      {session === null ? (
        <div id="join">
          <div id="join-dialog" className="jumbotron vertical-center">
            <h1>Join a video session</h1>
            <form className="form-group" onSubmit={(e) => { e.preventDefault(); joinSession(); }}>
              <p>
                <label>Participant: </label>
                <input
                  className="form-control"
                  type="text"
                  id="userName"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  required
                />
              </p>
              <p>
                <label> Session: </label>
                <input
                  className="form-control"
                  type="text"
                  id="sessionId"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  required
                />
              </p>
              <p className="text-center">
                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
              </p>
            </form>
          </div>
        </div>
      ) : null}

      {session !== null ? (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{mySessionId}</h1>
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="Leave session"
            />
            <input
              className="btn btn-large btn-success"
              type="button"
              id="buttonSwitchCamera"
              onClick={switchCamera}
              value="Switch Camera"
            />
          </div>

          {mainStreamManager !== null ? (
            <div id="main-video" className="col-md-6">
              <UserVideoComponent streamManager={mainStreamManager} />
            </div>
          ) : null}
          <div id="video-container" className="col-md-6">
            {publisher !== null ? (
              <div className="stream-container col-md-6 col-xs-6">
                <UserVideoComponent streamManager={publisher} />
              </div>
            ) : null}
            {subscribers.map((sub, i) => (
              <div key={sub.id} className="stream-container col-md-6 col-xs-6">
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
          <div id="chat-container" className="col-md-3">
            <div id="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <strong>{msg.from}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <input
              type="text"
              id="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendChatMessage}>Send</button>
          </div>
        </div>
      ) : null}
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