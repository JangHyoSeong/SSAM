import { useState, useEffect, useRef } from 'react';
import styles from './Video.module.scss';

// ChatBox 컴포넌트: 채팅 기능을 구현하는 React 컴포넌트
const ChatBox = ({ state, updateState, profileData }) => {
  // 채팅 입력값을 관리하는 상태
  const [chatInput, setChatInput] = useState('');
  // 채팅 컨테이너에 대한 참조
  const chatContainerRef = useRef(null);

  // 채팅 메시지가 추가될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [state.chatMessages]);

  // 세션이 존재할 때 'signal:chat' 이벤트 리스너 설정
  useEffect(() => {
    if (state.session) {
      state.session.on('signal:chat', (event) => {
        const data = JSON.parse(event.data);
        updateState(prevState => ({
          chatMessages: [...prevState.chatMessages, {
            ...data,
            // 메시지 발신자 구분 (본인 or 상대방)
            from: data.connectionId === state.session.connection.connectionId
              ? data.from
              : "상대방",
          }]
        }));
      });
    }
  }, [state.session, updateState]);

  // 채팅 메시지 전송 함수
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
      setChatInput(""); // 입력 필드 초기화
    }
  };

  return (
    <div className={styles.right}>
      <div className={styles.chatingArray}>
        <div className={styles.chatContainer}>
          {/* 채팅 메시지 표시 영역 */}
          <div className={styles.chating} ref={chatContainerRef}>
            {state.chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${
                  // 메시지 발신자에 따라 스타일 적용
                  msg.connectionId === state.session.connection.connectionId
                    ? styles.ownMessage
                    : styles.otherMessage
                }`}
              >
                <strong>
                  {/* 메시지 발신자 이름 표시 */}
                  {msg.connectionId === state.session.connection.connectionId
                    ? profileData.name
                    : "상대방"}{" "}
                  :{" "}
                </strong>
                {msg.message}
              </div>
            ))}
          </div>
          {/* 채팅 입력 필드 */}
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