// hooks/useSTT.js
import { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const apiUrl = import.meta.env.API_URL;

export const useSTT = (state, updateState) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const lastTranscriptRef = useRef("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (transcript === lastTranscriptRef.current && transcript.trim() !== "") {
          sendSTTMessage(transcript);
          resetTranscript();
        }
      }, 1000);
    }
  }, [transcript]);

  useEffect(() => {
    if (state.session && state.isMicOn) {
      SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [state.session, state.isMicOn]);

  const sendSTTMessage = async (text) => {
    if (text.trim() !== "" && state.session) {
      const messageData = {
        message: text,
        from: state.myUserName,
        connectionId: state.session.connection.connectionId,
      };
      try {
        const response = await axios.post(`${apiUrl}/v1/profanity/check`, { message: text });
        console.warn(response.data);
        let consecutiveOffensiveCount = 0;

        if (response.data.category === "공격발언") {
          consecutiveOffensiveCount = 1;
          console.warn("공격발언이 1회 감지되었습니다");
        }

        updateState(prevState => {
          const newMessages = [...prevState.sttMessages, messageData];
          const lastFiveMessages = newMessages.slice(-5);

          if (prevState.sttMessages.length > 0 && prevState.sttMessages[prevState.sttMessages.length - 1].category === "공격발언") {
            consecutiveOffensiveCount++;
            console.warn("공격발언이 2회 감지되었습니다");
          }

          if (consecutiveOffensiveCount >= 2) {
            updateState({ profanityDetected: true });
            setTimeout(() => updateState({ profanityDetected: false }), 1000);
            console.warn("연속된 공격발언이 감지되었습니다");
          }

          return { sttMessages: lastFiveMessages };
        });

        state.session.signal({
          data: JSON.stringify(messageData),
          type: "stt",
        });
      } catch (error) {
        console.error("비속어 확인 중 오류 발생:", error);
      }
    }
  };

  return { transcript, resetTranscript, browserSupportsSpeechRecognition };
};