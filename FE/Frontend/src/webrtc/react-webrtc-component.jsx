import React, { useState, useEffect, useRef } from 'react';

const WebRTCChat = () => {
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState(null);
    const webSocketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideosRef = useRef({});
    const [remoteVideoKeys, setRemoteVideoKeys] = useState([]);
    const peerConnectionsRef = useRef({});
    const localStreamRef = useRef(null);
    const [kurentoUtilsLoaded, setKurentoUtilsLoaded] = useState(false);
    const kurentoUtils = window.kurentoUtils;

    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/kurento-js-utils@6.16.0/kurento-utils.min.js';
        script.async = true;
        script.onload = () => setKurentoUtilsLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
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
        Object.values(peerConnectionsRef.current).forEach(pc => pc.dispose());
    };

    const createRoom = async () => {
        if (!room) {
            alert('Please enter a room name');
            return;
        }
        try {
            const response = await fetch(`https://i11e201.p.ssafy.io/api/v1/kurento/room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomName: room }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.text();
            console.log(result);
            alert(`Room "${room}" created successfully. You can now join it.`);
        } catch (error) {
            console.error('Error creating room:', error);
            setError(`Failed to create room: ${error.message}`);
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
            setError(`Failed to access camera and microphone: ${error.message}`);
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
        webSocketRef.current.onclose = () => setIsConnected(false);
        webSocketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
            setError('WebSocket connection error. Please try again.');
        };
    };

    const sendJoinRoomMessage = () => {
        sendWebSocketMessage({ id: 'joinRoom', room: room, name: username });
    };

    const handleMessage = (message) => {
        switch (message.id) {
            case 'existingParticipants': handleExistingParticipants(message); break;
            case 'newParticipantArrived': handleNewParticipant(message); break;
            case 'participantLeft': handleParticipantLeft(message); break;
            case 'receiveVideoAnswer': handleReceiveVideoAnswer(message); break;
            case 'iceCandidate': handleRemoteIceCandidate(message); break;
            case 'newChatMessage': handleNewChatMessage(message); break;
            default: console.log('Unhandled message:', message);
        }
    };

    const handleExistingParticipants = (message) => {
        setParticipants(message.data);
        if (!kurentoUtilsLoaded || !window.kurentoUtils) {
            console.error('Kurento Utils not loaded');
            setError('Kurento Utils not loaded. Please try again.');
            return;
        }

        const options = {
            localVideo: localVideoRef.current,
            mediaConstraints: { audio: true, video: true },
            onicecandidate: onIceCandidate
        };

        window.kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
            if (error) {
                console.error('Error creating WebRtcPeer:', error);
                setError(`Failed to create WebRtcPeer: ${error}`);
                return;
            }

            this.generateOffer((error, offerSdp) => {
                if (error) {
                    console.error('Error generating offer:', error);
                    setError(`Failed to generate offer: ${error}`);
                    return;
                }

                console.log('Invoking SDP offer callback function');
                sendWebSocketMessage({
                    id: 'receiveVideoFrom',
                    sender: username,
                    sdpOffer: offerSdp
                });
            });
        });
    };


    const handleNewParticipant = (message) => {
        setParticipants(prev => [...prev, message.name]);
    };

    const handleParticipantLeft = (message) => {
        setParticipants(prev => prev.filter(name => name !== message.name));
        if (peerConnectionsRef.current[message.name]) {
            peerConnectionsRef.current[message.name].dispose();
            delete peerConnectionsRef.current[message.name];
        }
        delete remoteVideosRef.current[message.name];
        setRemoteVideoKeys(Object.keys(remoteVideosRef.current));
    };

    const handleReceiveVideoAnswer = (message) => {
        peerConnectionsRef.current[message.name].processAnswer(message.sdpAnswer, (error) => {
            if (error) setError(`Failed to process answer: ${error}`);
        });
    };

    const handleRemoteIceCandidate = (message) => {
        peerConnectionsRef.current[message.name].addIceCandidate(message.candidate, (error) => {
            if (error) setError(`Failed to add ICE candidate: ${error}`);
        });
    };

    const onIceCandidate = (candidate) => {
        sendWebSocketMessage({ id: 'onIceCandidate', candidate: candidate });
    };

    const handleNewChatMessage = (message) => {
        setChatMessages(prev => [...prev, { sender: message.user, text: message.message }]);
    };

    const sendChatMessage = () => {
        if (message && isConnected) {
            sendWebSocketMessage({
                id: 'chatMessage',
                room: room,
                name: username,
                message: message,
            });
            setChatMessages(prev => [...prev, { sender: 'You', text: message }]);
            setMessage('');
        } else if (!isConnected) {
            alert('Not connected to a room. Please join a room first.');
        }
    };

    const sendWebSocketMessage = (message) => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">WebRTC Chat and Video Call</h1>
            {!kurentoUtilsLoaded && <p>Loading Kurento Utils...</p>}
            <h1>Deploy Ver.54</h1>
            <div className="mb-4">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" className="border p-2 mr-2" />
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Enter room name" className="border p-2 mr-2" />
                <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded mr-2">Create Room</button>
                <button onClick={joinRoom} className="bg-green-500 text-white p-2 rounded">Join Room</button>
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>}
            <div className="flex justify-between mb-4">
                <div className="w-1/2 mr-2">
                    <h2 className="text-lg font-semibold mb-2">Your Video</h2>
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full border"></video>
                </div>
                <div className="w-1/2 ml-2">
                    <h2 className="text-lg font-semibold mb-2">Remote Videos</h2>
                    <div className="flex flex-wrap">
                        {remoteVideoKeys.map(participantName => (
                            <div key={participantName} className="w-1/2 p-1">
                                <video id={`video-${participantName}`} autoPlay playsInline className="w-full border" />
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
                    <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
                ))}
            </div>
            <div className="flex">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message" className="border p-2 flex-grow mr-2" />
                <button onClick={sendChatMessage} className="bg-green-500 text-white p-2 rounded">Send</button>
            </div>
        </div>
    );
};

export default WebRTCChat;