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
    const iceCandidatesBuffer = useRef({});
    const [remoteVideos, setRemoteVideos] = useState({});

    const remoteVideosRef = useRef({});
    const [remoteVideoKeys, setRemoteVideoKeys] = useState([]);

    const peerConnectionsRef = useRef({});
    const localStreamRef = useRef(null);

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
        console.log('useEffect triggered. remoteVideoKeys:', remoteVideoKeys);
        remoteVideoKeys.forEach((key) => {
            const videoElement = document.getElementById(`video-${key}`);
            console.log(`Processing video element for key: ${key}`, videoElement);
            if (videoElement && remoteVideosRef.current[key]) {
                console.log(`Setting srcObject for key: ${key}`, remoteVideosRef.current[key]);
                videoElement.srcObject = remoteVideosRef.current[key];
                videoElement.play().catch((error) => console.log('Autoplay prevented:', error));
            } else {
                console.log(`Video element or remote video not found for key: ${key}`);
            }
        });
    }, [remoteVideoKeys]);

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

    const handleExistingParticipants = async (message) => {
        console.log('Existing participants:', message.data);
        setParticipants(message.data);

        const localStream = await setupLocalStream();

        for (const participantName of message.data) {
            if (participantName !== username) {
                await createPeerConnection(participantName, localStream);
            }
        }
    };

    const handleNewParticipant = async (message) => {
        console.log('New participant arrived:', message.name);
        setParticipants((prev) => [...prev, message.name]);
        await createPeerConnection(message.name);
    };

    // 새로운 함수 추가
    const handleNewChatMessage = (message) => {
        const { user, message: chatMessage } = message.params;
        setChatMessages((prevMessages) => [...prevMessages, { sender: user, text: chatMessage }]);
    };

    const createPeerConnection = async (participantName, localStream) => {
        console.log('Creating peer connection for:', participantName);
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionsRef.current[participantName] = peerConnection;

        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

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
            remoteVideosRef.current[participantName] = event.streams[0];
            setRemoteVideoKeys((prev) => Array.from(new Set([...prev, participantName])));
        };

        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('Local description set');
            sendWebSocketMessage({
                id: 'receiveVideoFrom',
                sender: username,
                receiver: participantName,
                sdpOffer: offer.sdp,
            });
        } catch (error) {
            console.error('Error creating offer:', error);
        }

        // 버퍼링된 ICE 후보 처리
        if (iceCandidatesBuffer.current[participantName]) {
            iceCandidatesBuffer.current[participantName].forEach((candidate) => {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) => console.error('Error adding buffered ice candidate:', e));
            });
            delete iceCandidatesBuffer.current[participantName];
        }
    };
    const handleParticipantLeft = (message) => {
        console.log('Participant left:', message.name);
        setParticipants((prev) => prev.filter((name) => name !== message.name));
        if (peerConnectionsRef.current[message.name]) {
            peerConnectionsRef.current[message.name].close();
            delete peerConnectionsRef.current[message.name];
        }
        delete remoteVideosRef.current[message.name];
        console.log('Before setRemoteVideoKeys:', Object.keys(remoteVideosRef.current));
        setRemoteVideoKeys(Object.keys(remoteVideosRef.current));
        console.log('After setRemoteVideoKeys called');
    };

    const handleReceiveVideoAnswer = async (message) => {
        console.log('Received video answer from:', message.name);
        const peerConnection = peerConnectionsRef.current[message.name];
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription({
                        type: 'answer',
                        sdp: message.sdpAnswer,
                    })
                );
                console.log('Remote description set successfully');
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        }
    };

    const handleRemoteIceCandidate = async (message) => {
        console.log('Handling remote ICE candidate from:', message.name);
        const peerConnection = peerConnectionsRef.current[message.name];
        if (peerConnection) {
            if (peerConnection.remoteDescription) {
                try {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
                    console.log('ICE candidate added successfully');
                } catch (error) {
                    console.error('Error adding received ice candidate:', error);
                }
            } else {
                // 원격 설명이 아직 설정되지 않았다면 후보를 버퍼링
                if (!iceCandidatesBuffer.current[message.name]) {
                    iceCandidatesBuffer.current[message.name] = [];
                }
                iceCandidatesBuffer.current[message.name].push(message.candidate);
                console.log('ICE candidate buffered');
            }
        } else {
            console.error('No peer connection found for:', message.name);
        }
    };

    const monitorWebRTCConnection = (peerConnection) => {
        peerConnection.addEventListener('iceconnectionstatechange', () => {
            console.log('ICE connection state changed:', peerConnection.iceConnectionState);
        });

        peerConnection.addEventListener('connectionstatechange', () => {
            console.log('Connection state changed:', peerConnection.connectionState);
        });

        peerConnection.addEventListener('icegatheringstatechange', () => {
            console.log('ICE gathering state changed:', peerConnection.iceGatheringState);
        });

        peerConnection.addEventListener('signalingstatechange', () => {
            console.log('Signaling state changed:', peerConnection.signalingState);
        });

        // Monitor ICE candidate gathering
        let iceCandidatesGathered = 0;
        peerConnection.addEventListener('icecandidate', (event) => {
            if (event.candidate) {
                iceCandidatesGathered++;
                console.log('New ICE candidate gathered:', event.candidate.candidate);
                console.log('Total ICE candidates gathered:', iceCandidatesGathered);
            } else {
                console.log('ICE gathering completed. Total candidates:', iceCandidatesGathered);
            }
        });

        // Monitor data channel state
        peerConnection.addEventListener('datachannel', (event) => {
            const dataChannel = event.channel;
            console.log('Data channel created:', dataChannel.label);

            dataChannel.addEventListener('open', () => {
                console.log('Data channel opened:', dataChannel.label);
            });

            dataChannel.addEventListener('close', () => {
                console.log('Data channel closed:', dataChannel.label);
            });
        });

        // Monitor stats
        const getStats = () => {
            peerConnection.getStats(null).then((stats) => {
                stats.forEach((report) => {
                    if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                        console.log('Active ICE candidate pair:', report);
                    }
                });
            });
        };

        // Get stats every 5 seconds
        setInterval(getStats, 5000);
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
            <h1>Build ver.65</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="border p-2 mr-2"
                />
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Enter room name" className="border p-2 mr-2" />
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
                        {remoteVideoKeys.map((participantName) => (
                            <div key={participantName} className="w-1/2 p-1">
                                <video
                                    key={participantName}
                                    autoPlay
                                    playsInline
                                    className="w-full border"
                                    ref={(el) => {
                                        if (el) el.srcObject = remoteVideosRef.current[participantName];
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
