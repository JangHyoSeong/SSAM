import React, { useState, useEffect, useRef } from 'react';
import adapter from 'webrtc-adapter';

const WebRTCChat = () => {
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const webSocketRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerConnectionsRef = useRef({});
    const localStreamRef = useRef(null);
    const iceCandidatesBuffer = useRef({});
    const [remoteVideos, setRemoteVideos] = useState({});

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
                urls: 'turn:i11e201.p.ssafy.io:3478',
                username: 'admin',
                credential: 'JddU_RuEn5Iqc',
            },
        ],
        iceTransportPolicy: 'all',
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
            localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
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
            alert(`Room "${room}" created successfully. You can now join it.`);
        } catch (error) {
            console.error('Error creating room:', error);
            alert(`Failed to create room: ${error.message}`);
        }
    };

    const joinRoom = async () => {
        if (!room || !username) {
            alert('Please enter both room name and username');
            return;
        }

        await setupLocalStream();
        connectWebSocket();
    };

    const setupLocalStream = async () => {
        if (localStreamRef.current) return localStreamRef.current;

        try {
            console.log('Attempting to access local media devices');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true,
            });
            console.log('Local stream obtained:', stream);
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            console.log('Local video source set');
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Failed to access camera and microphone. Please check your permissions.');
            throw error;
        }
    };

    const connectWebSocket = () => {
        console.log('Attempting to connect WebSocket...');
        const wsUrl = `wss://i11e201.p.ssafy.io/api/v1/kurento`;

        webSocketRef.current = new WebSocket(wsUrl);

        webSocketRef.current.onopen = () => {
            console.log('WebSocket connection established');
            setIsConnected(true);
            sendJoinRoomMessage();
        };

        webSocketRef.current.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            try {
                const message = JSON.parse(event.data);
                handleMessage(message);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        webSocketRef.current.onclose = () => {
            console.log('WebSocket connection closed');
            setIsConnected(false);
        };

        webSocketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
            alert('WebSocket connection error. Please try again.');
        };
    };

    const sendJoinRoomMessage = () => {
        console.log('Sending join room message');
        const joinMessage = {
            id: 'joinRoom',
            room: room,
            name: username,
        };
        sendWebSocketMessage(joinMessage);
    };

    const handleMessage = (message) => {
        console.log('Processing received message:', message);
        switch (message.id) {
            case 'existingParticipants':
                handleExistingParticipants(message);
                break;
            case 'newParticipantArrived':
                handleNewParticipant(message);
                break;
            case 'participantLeft':
                handleParticipantLeft(message);
                break;
            case 'receiveVideoAnswer':
                handleReceiveVideoAnswer(message);
                break;
            case 'iceCandidate':
                handleRemoteIceCandidate(message);
                break;
            case 'newChatMessage':
                handleNewChatMessage(message);
                break;
            default:
                console.log('Unhandled message:', message);
        }
    };

    const createPeerConnection = async (participantName) => {
        console.log('Creating peer connection for:', participantName);
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionsRef.current[participantName] = peerConnection;

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('New ICE candidate:', event.candidate);
                sendWebSocketMessage({
                    id: 'onIceCandidate',
                    candidate: event.candidate,
                    name: username,
                    to: participantName,
                });
            }
        };

        peerConnection.ontrack = (event) => {
            console.log('Received remote track from', participantName, event.streams[0]);
            setRemoteVideos(prevVideos => ({
                ...prevVideos,
                [participantName]: event.streams[0]
            }));
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log(`ICE connection state for ${participantName}:`, peerConnection.iceConnectionState);
        };

        peerConnection.onsignalingstatechange = () => {
            console.log(`Signaling state for ${participantName}:`, peerConnection.signalingState);
        };

        if (!localStreamRef.current) {
            await setupLocalStream();
        }

        localStreamRef.current.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStreamRef.current);
        });

        return peerConnection;
    };

    const handleExistingParticipants = async (message) => {
        console.log('Existing participants:', message.data);
        setParticipants(message.data);

        for (const participantName of message.data) {
            if (participantName !== username) {
                await initiatePeerConnection(participantName);
            }
        }
    };

    const initiatePeerConnection = async (participantName) => {
        const peerConnection = await createPeerConnection(participantName);
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('Local description set for', participantName);

            sendWebSocketMessage({
                id: 'receiveVideoFrom',
                sender: username,
                receiver: participantName,
                sdpOffer: offer.sdp,
            });
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const handleNewParticipant = async (message) => {
        console.log('New participant arrived:', message.name);
        setParticipants(prev => [...prev, message.name]);
        await createPeerConnection(message.name);
    };

    const handleReceiveVideoAnswer = async (message) => {
        console.log('Received video answer from:', message.name);
        const peerConnection = peerConnectionsRef.current[message.name];
        if (peerConnection) {
            try {
                const signalingState = peerConnection.signalingState;
                console.log(`Current signaling state for ${message.name}:`, signalingState);
    
                if (signalingState === 'have-local-offer') {
                    const remoteDesc = new RTCSessionDescription({
                        type: 'answer',
                        sdp: message.sdpAnswer,
                    });
                    await peerConnection.setRemoteDescription(remoteDesc);
                    console.log('Remote description set successfully for', message.name);
    
                    // 처리되지 않은 ICE 후보 추가
                    if (iceCandidatesBuffer.current[message.name]) {
                        const candidates = iceCandidatesBuffer.current[message.name];
                        for (const candidate of candidates) {
                            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                        }
                        delete iceCandidatesBuffer.current[message.name];
                        console.log('Buffered ICE candidates added for', message.name);
                    }
                } else if (signalingState === 'stable') {
                    console.warn(`Ignoring answer for ${message.name} as connection is already stable`);
                } else {
                    console.warn(`Unexpected signaling state for ${message.name}:`, signalingState);
                }
            } catch (error) {
                console.error('Error setting remote description:', error);
                // 오류 복구 시도
                await setRemoteDescriptionOnFailure(peerConnection, message);
            }
        } else {
            console.error('PeerConnection not found for', message.name);
        }
    };

    const handleRemoteIceCandidate = async (message) => {
        console.log('Handling remote ICE candidate from:', message.name);
        const peerConnection = peerConnectionsRef.current[message.name];
        if (peerConnection && peerConnection.remoteDescription) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
                console.log('ICE candidate added successfully for', message.name);
            } catch (error) {
                console.error('Error adding received ice candidate:', error);
            }
        } else {
            if (!iceCandidatesBuffer.current[message.name]) {
                iceCandidatesBuffer.current[message.name] = [];
            }
            iceCandidatesBuffer.current[message.name].push(message.candidate);
            console.log('ICE candidate buffered for', message.name);
        }
    };

    const handleParticipantLeft = (message) => {
        console.log('Participant left:', message.name);
        setParticipants((prev) => prev.filter((name) => name !== message.name));
        if (peerConnectionsRef.current[message.name]) {
            peerConnectionsRef.current[message.name].close();
            delete peerConnectionsRef.current[message.name];
        }
        setRemoteVideos(prevVideos => {
            const newVideos = {...prevVideos};
            delete newVideos[message.name];
            return newVideos;
        });
    };

    const setRemoteDescriptionOnFailure = async (peerConnection, message) => {
        try {
            // 현재 연결 상태 확인
            console.log('Attempting to recover from setRemoteDescription failure');
            console.log('Current signaling state:', peerConnection.signalingState);
            console.log('Current connection state:', peerConnection.connectionState);
            console.log('Current ICE connection state:', peerConnection.iceConnectionState);
    
            // 연결 재설정
            if (peerConnection.signalingState !== 'closed') {
                await peerConnection.setLocalDescription(await peerConnection.createOffer());
                const remoteDesc = new RTCSessionDescription({
                    type: 'answer',
                    sdp: message.sdpAnswer,
                });
                await peerConnection.setRemoteDescription(remoteDesc);
                console.log('Connection recovered for', message.name);
            } else {
                console.log('Connection is closed, cannot recover');
            }
        } catch (error) {
            console.error('Failed to recover connection:', error);
        }
    };

    const handleNewChatMessage = (message) => {
        const { user, message: chatMessage } = message.params;
        setChatMessages((prevMessages) => [...prevMessages, { sender: user, text: chatMessage }]);
    };

    const sendChatMessage = () => {
        if (message && isConnected) {
            console.log('Sending chat message');
            const chatMessage = {
                id: 'chatMessage',
                room: room,
                name: username,
                message: message,
            };
            sendWebSocketMessage(chatMessage);
            setChatMessages((prevMessages) => [...prevMessages, { sender: 'You', text: message }]);
            setMessage('');
        } else if (!isConnected) {
            alert('Not connected to a room. Please join a room first.');
        }
    };

    const sendWebSocketMessage = (message) => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            console.log('Sending WebSocket message:', message);
            webSocketRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected. Current state:', webSocketRef.current?.readyState);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">WebRTC Chat and Video Call</h1>
            <h1>Build ver.67 (with adapter.js)</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="border p-2 mr-2"
                />
                <input 
                    type="text" 
                    value={room} 
                    onChange={(e) => setRoom(e.target.value)} 
                    placeholder="Enter room name" 
                    className="border p-2 mr-2" 
                />
                <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded mr-2">
                    Create Room
                </button>
                <button onClick={joinRoom} className="bg-green-500 text-white p-2 rounded">
                    Join Room
                </button>
            </div>

            <div className="flex justify-between mb-4">
                <div className="w-1/2 mr-2">
                    <h2 className="text-lg font-semibold mb-2">Your Video</h2>
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full border"></video>
                </div>
                <div className="w-1/2 ml-2">
                    <h2 className="text-lg font-semibold mb-2">Remote Videos</h2>
                    <div className="flex flex-wrap">
                        {Object.entries(remoteVideos).map(([participantName, stream]) => (
                            <div key={participantName} className="w-1/2 p-1">
                                <video
                                    autoPlay
                                    playsInline
                                    className="w-full border"
                                    ref={(el) => {
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
    );
};

export default WebRTCChat;