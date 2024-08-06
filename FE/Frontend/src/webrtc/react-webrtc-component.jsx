import React, { useEffect, useRef, useState } from 'react';
import adapter from 'webrtc-adapter';

const RefactoredWebRTC = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [mediaError, setMediaError] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const configuration = {
    iceServers: [
      { urls: 'stun:i11e201.p.ssafy.io:3478' },
      {
        urls: 'turn:i11e201.p.ssafy.io:3478',
        username: 'admin',
        credential: 'JddU_RuEn5Iqc',
      },
    ],
    iceTransportPolicy: 'all',
  };

  useEffect(() => {
    startLocalStream();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: true 
      });
      console.log('Local stream obtained:', stream);
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Set local video source');
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setMediaError(error.message);
    }
  };

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.onloadedmetadata = () => {
        console.log('Local video metadata loaded');
        localVideoRef.current.play().catch(e => console.error('Error auto-playing local video:', e));
      };
      localStream.getTracks().forEach(track => {
        console.log(`Local ${track.kind} track:`, track.label, 'enabled:', track.enabled, 'muted:', track.muted);
      });
    }
  }, [localStream]);
  const createPeerConnection = () => {
    console.log('Creating peer connection');
    const peerConnection = new RTCPeerConnection(configuration);
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
    };

    peerConnection.onsignalingstatechange = () => {
      console.log('Signaling state:', peerConnection.signalingState);
    };

    peerConnection.ontrack = (event) => {
      console.log('Received remote track:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  };

  const createOffer = async () => {
    const peerConnection = createPeerConnection();
    try {
      const offer = await peerConnection.createOffer();
      console.log('Created offer:', offer);
      await peerConnection.setLocalDescription(offer);
      console.log('Set local description');
      setOffer(JSON.stringify(offer));
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const createAnswer = async () => {
    const peerConnection = createPeerConnection();
    try {
      await peerConnection.setRemoteDescription(JSON.parse(offer));
      console.log('Set remote description (offer)');
      const answer = await peerConnection.createAnswer();
      console.log('Created answer:', answer);
      await peerConnection.setLocalDescription(answer);
      console.log('Set local description (answer)');
      setAnswer(JSON.stringify(answer));
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const addAnswer = async () => {
    try {
      const remoteDesc = JSON.parse(answer);
      await peerConnectionRef.current.setRemoteDescription(remoteDesc);
      console.log('Set remote description (answer)');
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log('Setting remote stream to video element');
      remoteVideoRef.current.srcObject = remoteStream;
      
      remoteVideoRef.current.onloadedmetadata = () => {
        console.log('Remote video metadata loaded');
        remoteVideoRef.current.play().catch(e => console.error('Error auto-playing video:', e));
      };
  
      remoteStream.getTracks().forEach(track => {
        console.log(`${track.kind} track:`, track.label, 'enabled:', track.enabled, 'muted:', track.muted);
        track.onended = () => console.log(`${track.kind} track ended:`, track.label);
        track.onmute = () => console.log(`${track.kind} track muted:`, track.label);
        track.onunmute = () => console.log(`${track.kind} track unmuted:`, track.label);
      });

      // 스트림 상태 모니터링
      const monitorStream = setInterval(() => {
        remoteStream.getTracks().forEach(track => {
          console.log(`${track.kind} track state:`, track.readyState);
        });
      }, 5000);

      return () => clearInterval(monitorStream);
    }
  }, [remoteStream]);

  return (
    <div>
      <h2>Local Video</h2>
      {mediaError ? (
        <div style={{color: 'red'}}>Error: {mediaError}</div>
      ) : (
        <video 
          ref={localVideoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{width: '400px', height: '300px', border: '1px solid black'}}
          onLoadedMetadata={() => console.log('Local video metadata loaded')}
          onPlay={() => console.log('Local video started playing')}
          onError={(e) => console.error('Local video error:', e)}
        />
      )}
      <h2>Remote Video</h2>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        controls
        style={{width: '400px', height: '300px', border: '1px solid black'}}
        onLoadedMetadata={() => console.log('Metadata loaded')}
        onCanPlay={() => console.log('Can play')}
        onPlaying={() => {
            console.log('Playing');
            const videoTrack = remoteVideoRef.current.srcObject.getVideoTracks()[0];
            console.log('Video track enabled:', videoTrack.enabled, 'muted:', videoTrack.muted);
        }}
        onWaiting={() => console.log('Waiting')}
        onError={(e) => console.error('Video error:', e.target.error)}
        />
      <div>
        <button onClick={createOffer}>Create Offer</button>
        <textarea
          value={offer || ''}
          onChange={(e) => setOffer(e.target.value)}
          placeholder="Paste offer here"
        />
      </div>
      <div>
        <button onClick={createAnswer}>Create Answer</button>
        <textarea
          value={answer || ''}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Paste answer here"
        />
      </div>
      <button onClick={addAnswer}>Add Answer</button>
    </div>
  );
};

export default RefactoredWebRTC;