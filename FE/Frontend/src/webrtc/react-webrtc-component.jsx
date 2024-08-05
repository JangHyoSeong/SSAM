import React, { useState, useEffect, useRef } from 'react';

const WebRTCChat = () => {
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const webSocketRef = useRef(null);
    const localVideoRef = useRef(null);
    const [remoteVideos, setRemoteVideos] = useState({});
    const peerConnectionsRef = useRef({});
    const localStreamRef = useRef(null);

    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    useEffect(() => {
        return () => {
            closeWebSocketConnection();
            cleanupWebRTC();
        };
    }, []);

    const closeWebSocketConnection = () => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.close();
        }
    };

    const cleanupWebRTC = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    };

    const createRoom = async () => {
        if (!room) {
            alert('Please enter a room name');
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

            await joinRoom();
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const joinRoom = async () => {
        try {
            await startLocalStream();

            webSocketRef.current = new WebSocket(`wss://i11e201.p.ssafy.io/ws/kurento?room=${room}&name=${username}`);

            webSocketRef.current.onopen = () => {
                setIsConnected(true);
                console.log('WebSocket connection opened');
            };

            webSocketRef.current.onmessage = async (message) => {
                const parsedMessage = JSON.parse(message.data);
                console.log('Received message:', parsedMessage);

                switch (parsedMessage.type) {
                    case 'offer':
                        await handleOffer(parsedMessage);
                        break;
                    case 'answer':
                        await handleAnswer(parsedMessage);
                        break;
                    case 'candidate':
                        await handleCandidate(parsedMessage);
                        break;
                    case 'participant':
                        addParticipant(parsedMessage.name);
                        break;
                    default:
                        break;
                }
            };

            webSocketRef.current.onclose = () => {
                setIsConnected(false);
                console.log('WebSocket connection closed');
            };

            webSocketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log('Local stream obtained:', stream);
            localVideoRef.current.srcObject = stream;
            localStreamRef.current = stream;
        } catch (error) {
            console.error('Error accessing local media devices:', error);
        }
    };

    const createPeerConnection = (participantName) => {
        console.log('Creating peer connection for:', participantName);
        const pc = new RTCPeerConnection(configuration);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate generated:', event.candidate);
                sendSignal({ type: 'candidate', candidate: event.candidate, to: participantName });
            }
        };

        pc.ontrack = (event) => {
            console.log('Remote stream received from:', participantName, event.streams[0]);
            setRemoteVideos(prev => ({ ...prev, [participantName]: event.streams[0] }));
        };

        localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));

        return pc;
    };

    const sendSignal = (message) => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify(message));
        }
    };

    const handleOffer = async (message) => {
        const pc = createPeerConnection(message.name);
        peerConnectionsRef.current[message.name] = pc;

        await pc.setRemoteDescription(new RTCSessionDescription(message.offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        sendSignal({ type: 'answer', answer: pc.localDescription, to: message.name });
    };

    const handleAnswer = async (message) => {
        const pc = peerConnectionsRef.current[message.name];
        await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
    };

    const handleCandidate = async (message) => {
        const pc = peerConnectionsRef.current[message.name];
        await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    };

    const addParticipant = (participantName) => {
        setParticipants(prev => [...prev, participantName]);
    };

    const sendChatMessage = () => {
        if (message.trim()) {
            sendSignal({ type: 'chat', text: message, sender: username });
            setChatMessages(prev => [...prev, { sender: username, text: message }]);
            setMessage('');
        }
    };

    return (
        <div>
            <h1>WebRTC Chat</h1>
            <h1>Build Ver.52</h1>

            {!isConnected ? (
                <div>
                    <input
                        type="text"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        placeholder="Room name"
                    />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <button onClick={createRoom}>Create/Join Room</button>
                </div>
            ) : (
                <div>
                    <h2>Room: {room}</h2>
                    <h2>Username: {username}</h2>

                    <div className="flex">
                        <div className="w-1/2 p-1">
                            <video
                                autoPlay
                                playsInline
                                muted
                                className="w-full border"
                                ref={localVideoRef}
                            />
                            <p className="text-center">Local Video</p>
                        </div>

                        <div className="w-1/2 p-1">
                            <h2 className="text-lg font-semibold mb-2">Remote Videos</h2>
                            <div className="flex flex-wrap">
                                {Object.entries(remoteVideos).map(([participantName, stream]) => (
                                    <div key={participantName} className="w-1/2 p-1">
                                        <video
                                            autoPlay
                                            playsInline
                                            className="w-full border"
                                            ref={el => {
                                                if (el) el.srcObject = stream;
                                            }}
                                        />
                                        <p className="text-center">{participantName}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Participants</h2>
                        <ul>
                            {participants.map((participant, index) => (
                                <li key={index}>{participant}</li>
                            ))}
                        </ul>
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
                            placeholder="Type your message"
                            className="border p-2 flex-grow mr-2"
                        />
                        <button onClick={sendChatMessage} className="bg-green-500 text-white p-2 rounded">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebRTCChat;
