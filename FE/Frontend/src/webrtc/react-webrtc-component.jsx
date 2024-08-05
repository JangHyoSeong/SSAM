import React, { useState, useEffect, useRef } from 'react';

const WebRTCChat = () => {
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const webSocketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideosRef = useRef({});
    const peerConnections = useRef({});
    const localStreamRef = useRef(null);

    useEffect(() => {
        return () => {
            closeWebSocketConnection();
            closePeerConnections();
        };
    }, []);

    const closeWebSocketConnection = () => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.close();
        }
    };

    const closePeerConnections = () => {
        Object.values(peerConnections.current).forEach((pc) => pc.close());
        peerConnections.current = {};
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
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
        if (!room) {
            alert('Please enter a room name');
            return;
        }

        try {
            await setupLocalStream();
            closeWebSocketConnection();
            connectWebSocket();
        } catch (error) {
            console.error('Error joining room:', error);
            alert(`Failed to join room: ${error.message}`);
        }
    };

    const setupLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    };

    const connectWebSocket = () => {
        const wsUrl = `wss://i11e201.p.ssafy.io/api/v1/kurento`;
        webSocketRef.current = new WebSocket(wsUrl);

        webSocketRef.current.onopen = () => {
            setIsConnected(true);
            sendJoinRoomMessage();
        };

        webSocketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleMessage(message);
        };

        webSocketRef.current.onclose = () => {
            setIsConnected(false);
        };

        webSocketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };
    };

    const sendJoinRoomMessage = () => {
        sendWebSocketMessage({
            id: 'joinRoom',
            room: room,
            name: `User_${Math.floor(Math.random() * 1000)}`,
        });
    };

    const handleMessage = async (message) => {
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
                handleIceCandidate(message);
                break;
            case 'newChatMessage':
                handleNewChatMessage(message);
                break;
            default:
                console.log('Unhandled message:', message);
        }
    };

    const handleExistingParticipants = (message) => {
        const existingUsers = message.data.split(',');
        setParticipants(existingUsers);
        existingUsers.forEach((userName) => {
            createPeerConnection(userName);
        });
        sendWebSocketMessage({
            id: 'receiveVideoFrom',
            sender: 'me',
            sdpOffer: 'YOUR_SDP_OFFER', // You need to create and set the actual SDP offer here
        });
    };

    const handleNewParticipant = (message) => {
        setParticipants((prev) => [...prev, message.name]);
        createPeerConnection(message.name);
    };

    const handleParticipantLeft = (message) => {
        setParticipants((prev) => prev.filter((name) => name !== message.name));
        if (peerConnections.current[message.name]) {
            peerConnections.current[message.name].close();
            delete peerConnections.current[message.name];
        }
        if (remoteVideosRef.current[message.name]) {
            remoteVideosRef.current[message.name].srcObject = null;
        }
    };

    const handleReceiveVideoAnswer = (message) => {
        const pc = peerConnections.current[message.name];
        if (pc) {
            pc.setRemoteDescription(
                new RTCSessionDescription({
                    type: 'answer',
                    sdp: message.sdpAnswer,
                })
            );
        }
    };

    const handleIceCandidate = (message) => {
        const pc = peerConnections.current[message.name];
        if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    };

    const handleNewChatMessage = (message) => {
        setChatMessages((prev) => [...prev, { sender: message.user, text: message.message }]);
    };

    const createPeerConnection = (userName) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendWebSocketMessage({
                    id: 'onIceCandidate',
                    candidate: event.candidate,
                    name: userName,
                });
            }
        };

        pc.ontrack = (event) => {
            if (remoteVideosRef.current[userName]) {
                remoteVideosRef.current[userName].srcObject = event.streams[0];
            }
        };

        localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current);
        });

        peerConnections.current[userName] = pc;

        pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
                sendWebSocketMessage({
                    id: 'receiveVideoFrom',
                    sender: userName,
                    sdpOffer: pc.localDescription.sdp,
                });
            })
            .catch(console.error);
    };

    const sendChatMessage = () => {
        if (message && isConnected) {
            sendWebSocketMessage({
                id: 'chatMessage',
                room: room,
                name: 'User_' + Math.floor(Math.random() * 1000),
                message: message,
            });
            setChatMessages((prev) => [...prev, { sender: 'You', text: message }]);
            setMessage('');
        } else if (!isConnected) {
            alert('Not connected to a room. Please join a room first.');
        }
    };

    const sendWebSocketMessage = (message) => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected. Current state:', webSocketRef.current?.readyState);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">WebRTC Chat and Video Call</h1>

            <div className="mb-4">
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Enter room name" className="border p-2 mr-2" />
                <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded mr-2">
                    Create Room
                </button>
                <button onClick={joinRoom} className="bg-green-500 text-white p-2 rounded">
                    Join Room
                </button>
            </div>

            <div className="flex flex-wrap justify-between mb-4">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-1/3 border"></video>
                {participants.map((userName) => (
                    <video key={userName} ref={(el) => (remoteVideosRef.current[userName] = el)} autoPlay playsInline className="w-1/3 border"></video>
                ))}
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
