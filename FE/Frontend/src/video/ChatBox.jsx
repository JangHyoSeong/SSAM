// components/ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './Video.module.scss';

const ChatBox = ({ state, updateState, profileData }) => {
  const [chatInput, setChatInput] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [state.chatMessages]);

  useEffect(() => {
    if (state.session) {
      state.session.on('signal:chat', (event) => {
        const data = JSON.parse(event.data);
        updateState(prevState => ({
          chatMessages: [...prevState.chatMessages, {
            ...data,
            from: data.connectionId === state.session.connection.connectionId
              ? data.from
              : "상대방",
          }]
        }));
      });
    }
  }, [state.session, updateState]);

  const sendChatMessage = () => {
    if (chatInput.trim() !== "" && state.session) {
      const messageData = {
        message: chatInput,
        from: profileData.name,
        connectionId: state.session.connection.connectionId,
      };
      state.session.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });
      setChatInput("");
    }
  };

  return (
    <div className={styles.right}>
      <div className={styles.chatingArray}>
        <div className={styles.chatContainer}>
          <div className={styles.chating} ref={chatContainerRef}>
            {state.chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${
                  msg.connectionId === state.session.connection.connectionId
                    ? styles.ownMessage
                    : styles.otherMessage
                }`}
              >
                <strong>
                  {msg.connectionId === state.session.connection.connectionId
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
  );
};

export default ChatBox;