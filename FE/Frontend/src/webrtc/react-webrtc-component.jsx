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
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
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
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
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
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            localVideoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Failed to access camera and microphone. Please check your permissions.');
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
            default:
                console.log('Unhandled message:', message);
        }
    };

    const handleExistingParticipants = async (message) => {
        console.log('Existing participants:', message.data);
        setParticipants(message.data);
        
        peerConnectionRef.current = new RTCPeerConnection(configuration);

        localStreamRef.current.getTracks().forEach(track => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                sendWebSocketMessage({
                    id: 'onIceCandidate',
                    candidate: event.candidate,
                    name: username
                });
            }
        };

        peerConnectionRef.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            sendWebSocketMessage({
                id: 'receiveVideoFrom',
                sender: username,
                sdpOffer: offer.sdp
            });
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const handleNewParticipant = (message) => {
        console.log('New participant arrived:', message.name);
        setParticipants(prev => [...prev, message.name]);
    };

    const handleParticipantLeft = (message) => {
        console.log('Participant left:', message.name);
        setParticipants(prev => prev.filter(name => name !== message.name));
    };

    const handleReceiveVideoAnswer = async (message) => {
        console.log('Received video answer from:', message.name);
        try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: message.sdpAnswer
            }));
        } catch (error) {
            console.error('Error setting remote description:', error);
        }
    };

    const handleRemoteIceCandidate = async (message) => {
        try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
        } catch (error) {
            console.error('Error adding received ice candidate:', error);
        }
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
            setChatMessages(prevMessages => [...prevMessages, { sender: 'You', text: message }]);
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
            <h1>Build ver.47</h1>
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
                    <h2 className="text-lg font-semibold mb-2">Remote Video</h2>
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full border"></video>
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