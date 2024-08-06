import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
const API_BASE_URL = 'http://localhost:8081/v1/video';

const VideoChatComponent = () => {
  const [mySessionId, setMySessionId] = useState('SessionA');
  const [myUserName, setMyUserName] = useState(`Participant${Math.floor(Math.random() * 100)}`);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [myConnectionId, setMyConnectionId] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({ before: null, after: null });

  const OV = useRef(new OpenVidu());

  const joinSession = useCallback(async () => {
    const mySession = OV.current.initSession();

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      setSubscribers(prevSubscribers => {
        if (prevSubscribers.some(sub => sub.stream.connection.connectionId === subscriber.stream.connection.connectionId)) {
          return prevSubscribers;
        }
        return [...prevSubscribers, subscriber];
      });
    });

    mySession.on('streamDestroyed', (event) => {
      setSubscribers(prevSubscribers => 
        prevSubscribers.filter(sub => sub.stream.connection.connectionId !== event.stream.connection.connectionId)
      );
    });

    try {
      const token = await getToken();
      
      console.log('Before connect:', mySession);
      setSessionInfo(prev => ({ ...prev, before: JSON.stringify(mySession, null, 2) }));

      await mySession.connect(token, { clientData: myUserName });
      
      console.log('After connect:', mySession);
      setSessionInfo(prev => ({ ...prev, after: JSON.stringify(mySession, null, 2) }));

      setMyConnectionId(mySession.connection.connectionId);
      console.log('New connection ID:', mySession.connection.connectionId);

      const publisher = await OV.current.initPublisherAsync(undefined, {
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
      setSession(mySession);
      setPublisher(publisher);
    } catch (error) {
      console.error('Error joining session:', error);
    }
  }, [mySessionId, myUserName]);

  const sendChatMessage = useCallback(() => {
    if (chatInput.trim() && session) {
      const messageData = { message: chatInput, from: myUserName, connectionId: myConnectionId };
      session.signal({ data: JSON.stringify(messageData), type: 'chat' });
      setChatMessages(prev => [...prev, messageData]);
      setChatInput('');
    }
  }, [chatInput, myUserName, session, myConnectionId]);

  useEffect(() => {
    if (session) {
      const handleSignal = (event) => {
        const data = JSON.parse(event.data);
        if (data.connectionId !== myConnectionId) {
          setChatMessages(prev => [...prev, data]);
        }
      };

      session.on('signal:chat', handleSignal);
      return () => {
        session.off('signal:chat', handleSignal);
      };
    }
  }, [session, myConnectionId]);

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
                  onChange={(e) => setMyUserName(e.target.value)}
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
                  onChange={(e) => setMySessionId(e.target.value)}
                  required
                />
              </p>
              <p className="text-center">
                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
              </p>
            </form>
          </div>
        </div>
      ) : (
        <div id="session">
          <div id="session-header">
            <h1 id="session-title">{mySessionId}</h1>
            <p>My Connection ID: {myConnectionId}</p>
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
          <div id="main-container" className="row">
            <div id="video-container" className="col-md-9">
              <div id="main-video" className="col-md-12">
                {publisher && (
                  <UserVideoComponent streamManager={publisher} />
                )}
              </div>
              <div id="video-grid" className="row">
                {subscribers.map((sub) => (
                  <div key={sub.stream.connection.connectionId} className="col-md-4 stream-container">
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
            </div>
            <div id="chat-container" className="col-md-3">
              <div id="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={`${msg.connectionId}-${index}`} className="chat-message">
                    <strong>{msg.from}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <div id="chat-input-container">
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
          </div>
          <div id="session-info">
            <h3>Session Info:</h3>
            <div>
              <h4>Before Connect:</h4>
              <pre>{sessionInfo.before}</pre>
            </div>
            <div>
              <h4>After Connect:</h4>
              <pre>{sessionInfo.after}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoChatComponent;