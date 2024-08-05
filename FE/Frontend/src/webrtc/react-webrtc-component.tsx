import React, { useState, useEffect, useRef } from 'react';

const WebRTCChat = () => {
    // 상태 변수들: 방 이름, 메시지, 채팅 메시지 목록, 연결 상태 관리
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // WebSocket과 비디오 요소에 대한 ref
    const webSocketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    useEffect(() => {
        return () => {
            closeWebSocketConnection();
        };
    }, []);

    // WebSocket 연결을 닫는 함수
    const closeWebSocketConnection = () => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.close();
        }
    };

    // 새로운 방을 생성하는 함수 (서버에 POST 요청)
    const createRoom = async () => {
        if (!room) {
            alert('방 이름을 입력하세요');
            return;
        }

        try {
            const response = await fetch(`https://i11e201.p.ssafy.io/api/v1/kurento/room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomName: room }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            console.log(result);
            alert(`방 "${room}"이(가) 성공적으로 생성되었습니다. 이제 참여할 수 있습니다.`);
        } catch (error) {
            console.error('방 생성 오류:', error);
            alert(`방 생성에 실패했습니다: ${error.message}`);
        }
    };

    // 기존 방에 참여하는 함수
    const joinRoom = () => {
        if (!room) {
            alert('방 이름을 입력하세요');
            return;
        }

        closeWebSocketConnection();
        connectWebSocket();
    };

    // WebSocket 서버에 연결하는 함수
    const connectWebSocket = () => {
        console.log('WebSocket 연결 시도 중...');
        const wsUrl = `ws://i11e201.p.ssafy.io/api/v1/kurento`;

        console.log(`WebSocket URL에 연결 중: ${wsUrl}`);
        webSocketRef.current = new WebSocket(wsUrl);

        // WebSocket 연결에 대한 이벤트 핸들러
        webSocketRef.current.onopen = (event) => {
            console.log('WebSocket 연결 성공', event);
            setIsConnected(true);
            sendJoinRoomMessage();
        };

        webSocketRef.current.onmessage = (event) => {
            console.log('WebSocket 메시지 수신:', event.data);
            try {
                const message = JSON.parse(event.data);
                handleMessage(message);
            } catch (error) {
                console.error('메시지 파싱 오류:', error);
            }
        };

        webSocketRef.current.onclose = (event) => {
            console.log('WebSocket 연결 종료', event);
            setIsConnected(false);
        };

        webSocketRef.current.onerror = (error) => {
            console.error('WebSocket 오류:', error);
            setIsConnected(false);
        };
    };

    // WebSocket을 통해 방 참여 메시지를 보내는 함수
    const sendJoinRoomMessage = () => {
        console.log('방 참여 메시지 전송');
        const joinMessage = {
            jsonrpc: '2.0',
            method: 'join',
            params: {
                room: room,
                name: 'User_' + Math.floor(Math.random() * 1000),
            },
            id: Date.now(),
        };
        sendWebSocketMessage(joinMessage);
    };

    // 들어오는 WebSocket 메시지를 처리하는 함수
    const handleMessage = (message) => {
        console.log('수신한 메시지:', message);
        if (message.error) {
            console.error('수신한 오류:', message.error);
            return;
        }
        if (message.result) {
            switch (message.result.id) {
                case 'joinedRoom':
                    console.log('방 참여 성공:', message.result.roomName);
                    break;
                case 'leftRoom':
                    console.log('방 나감');
                    break;
                case 'newChatMessage':
                    if (message.result.user && message.result.message) {
                        setChatMessages((prev) => [...prev, { sender: message.result.user, text: message.result.message }]);
                    }
                    break;
                default:
                    console.log('처리되지 않은 메시지:', message);
            }
        }
    };

    // WebSocket을 통해 채팅 메시지를 보내는 함수
    const sendChatMessage = () => {
        if (message && isConnected) {
            console.log('채팅 메시지 전송');
            const chatMessage = {
                jsonrpc: '2.0',
                method: 'chatMessage',
                params: {
                    room: room,
                    name: 'User_' + Math.floor(Math.random() * 1000),
                    message: message,
                },
                id: Date.now(),
            };
            sendWebSocketMessage(chatMessage);
            setChatMessages((prev) => [...prev, { sender: 'You', text: message }]);
            setMessage('');
        } else if (!isConnected) {
            alert('방에 연결되지 않았습니다. 먼저 방에 참여하세요.');
        }
    };

    // WebSocket을 통해 메시지를 보내는 함수
    const sendWebSocketMessage = (message) => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            console.log('WebSocket 메시지 전송:', message);
            webSocketRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket이 연결되지 않았습니다. 현재 상태:', webSocketRef.current?.readyState);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">WebRTC 채팅 및 영상 통화</h1>

            <div className="mb-4">
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="방 이름 입력" className="border p-2 mr-2" />
                <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded mr-2">
                    방 생성
                </button>
                <button onClick={joinRoom} className="bg-green-500 text-white p-2 rounded">
                    방 참여
                </button>
            </div>

            <div className="flex justify-between mb-4">
                <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border"></video>
                <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border"></video>
            </div>

            <div className="border p-4 h-64 overflow-y-auto mb-4">
                {chatMessages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </p>
                ))}
            </div>

            <div className="flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    className="border p-2 flex-grow mr-2"
                />
                <button onClick={sendChatMessage} className="bg-green-500 text-white p-2 rounded">
                    전송
                </button>
            </div>
        </div>
    );
};

export default WebRTCChat;
