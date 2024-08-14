import { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

// 환경 변수에서 API URL을 가져옵니다.
const apiUrl = import.meta.env.API_URL;

// useSTT 커스텀 훅: 음성 인식 및 텍스트 처리를 위한 훅
export const useSTT = (state, updateState) => {
  // react-speech-recognition 훅을 사용하여 음성 인식 기능을 가져옵니다.
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  // 마지막으로 처리된 텍스트를 저장하는 ref
  const lastTranscriptRef = useRef("");
  // 타이머를 위한 ref
  const timeoutRef = useRef(null);

  // transcript가 변경될 때마다 실행되는 효과
  useEffect(() => {
    if (transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;

      // 이전 타이머가 있다면 취소합니다.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 1초 후에 텍스트를 처리하는 타이머를 설정합니다.
      timeoutRef.current = setTimeout(() => {
        if (transcript === lastTranscriptRef.current && transcript.trim() !== "") {
          sendSTTMessage(transcript);
          resetTranscript();
        }
      }, 1000);
    }
  }, [transcript]);

  // 세션 상태와 마이크 상태에 따라 음성 인식을 시작/중지하는 효과
  useEffect(() => {
    if (state.session && state.isMicOn) {
      SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [state.session, state.isMicOn]);

  // 음성 인식 결과를 처리하고 서버에 전송하는 함수
  const sendSTTMessage = async (text) => {
    if (text.trim() !== "" && state.session) {
      const messageData = {
        message: text,
        from: state.myUserName,
        connectionId: state.session.connection.connectionId,
      };
      try {
        // 비속어 확인 API 호출
        const response = await axios.post(`${apiUrl}/v1/profanity/check`, { message: text });
        console.warn(response.data);
        let consecutiveOffensiveCount = 0;

        // 공격발언 감지 로직
        if (response.data.category === "공격발언") {
          consecutiveOffensiveCount = 1;
          console.warn("공격발언이 1회 감지되었습니다");
        }

        // 상태 업데이트 및 연속 공격발언 감지
        updateState(prevState => {
          const newMessages = [...prevState.sttMessages, messageData];
          const lastFiveMessages = newMessages.slice(-5);

          if (prevState.sttMessages.length > 0 && prevState.sttMessages[prevState.sttMessages.length - 1].category === "공격발언") {
            consecutiveOffensiveCount++;
            console.warn("공격발언이 2회 감지되었습니다");
          }

          // 연속 공격발언 감지 시 profanityDetected 상태 업데이트
          if (consecutiveOffensiveCount >= 2) {
            updateState({ profanityDetected: true });
            setTimeout(() => updateState({ profanityDetected: false }), 1000);
            console.warn("연속된 공격발언이 감지되었습니다");
          }

          return { sttMessages: lastFiveMessages };
        });

        // 세션을 통해 STT 메시지 전송
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