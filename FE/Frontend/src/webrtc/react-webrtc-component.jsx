import React, { useState, useEffect, useRef } from 'react';

const WebRTCChat = () => {
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const webSocketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        return () => {
            closeWebSocketConnection();
        };
    }, []);

    const closeWebSocketConnection = () => {
        if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.close();
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

    const joinRoom = () => {
        if (!room) {
            alert('Please enter a room name');
            return;
        }

        closeWebSocketConnection();
        connectWebSocket();
    };

    const connectWebSocket = () => {
        console.log('Attempting to connect WebSocket...');
        const wsUrl = `wss://i11e201.p.ssafy.io/api/v1/kurento`;

        console.log(`Connecting to WebSocket URL: ${wsUrl}`);
        webSocketRef.current = new WebSocket(wsUrl);

        webSocketRef.current.onopen = (event) => {
            console.log('WebSocket connection established', event);
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

        webSocketRef.current.onclose = (event) => {
            console.log('WebSocket connection closed', event);
            setIsConnected(false);
        };

        webSocketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };
    };

    const sendJoinRoomMessage = () => {
        console.log('Sending join room message');
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

    const handleMessage = (message) => {
        console.log('Received message:', message);
        if (message.error) {
            console.error('Received error:', message.error);
            return;
        }
        if (message.result) {
            switch (message.result.id) {
                case 'joinedRoom':
                    console.log('Successfully joined room:', message.result.roomName);
                    break;
                case 'leftRoom':
                    console.log('Left room');
                    break;
                case 'newChatMessage':
                    if (message.result.user && message.result.message) {
                        setChatMessages((prev) => [...prev, { sender: message.result.user, text: message.result.message }]);
                    }
                    break;
                default:
                    console.log('Unhandled message:', message);
            }
        }
    };

    const sendChatMessage = () => {
        if (message && isConnected) {
            console.log('Sending chat message');
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

            <div className="mb-4">
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Enter room name" className="border p-2 mr-2" />
                <button onClick={createRoom} className="bg-blue-500 text-white p-2 rounded mr-2">
                    Create Room
                </button>
                <button onClick={joinRoom} className="bg-green-500 text-white p-2 rounded">
                    Join Room
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
