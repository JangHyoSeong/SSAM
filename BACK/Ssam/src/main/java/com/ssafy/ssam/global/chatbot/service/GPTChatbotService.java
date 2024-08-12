package com.ssafy.ssam.global.chatbot.service;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.global.amazonS3.service.S3ImageService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.chatbot.dto.Message;
import com.ssafy.ssam.global.chatbot.dto.request.*;
import com.ssafy.ssam.global.chatbot.dto.response.GPTResponse;
import com.ssafy.ssam.global.chatbot.dto.response.QuestionResponseDto;
import com.ssafy.ssam.global.chatbot.entity.ChatBot;
import com.ssafy.ssam.global.chatbot.repository.ChatbotRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import static com.ssafy.ssam.global.chatbot.util.AnswerPrompt;
import static com.ssafy.ssam.global.chatbot.util.imageUploadPrompt;

@Slf4j
@Service
@RequiredArgsConstructor
public class GPTChatbotService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final S3ImageService s3ImageService;
    private final ChatbotRepository chatbotRepository;

    // 학생이 질문하기
    public QuestionResponseDto askQuestion(QuestionRequestDto questionRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(()->new CustomException(ErrorCode.UserNotFoundException));
        Board board = boardRepository.findByBoardId(userDetails.getBoardId())
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        List<String> prompts = chatbotRepository.findContentByTimeAndBoardId
                        (LocalDateTime.now(), board.getBoardId())
                .orElseThrow(()->new CustomException(ErrorCode.BoardDataNotFound));

        StringBuilder message = new StringBuilder(AnswerPrompt).append("\n");
        for(String prompt : prompts) {
            message.append(prompt).append("\n");
        }

        GPTRequest request =
                GPTRequest.builder()
                        .model(model)
                        .messages(new ArrayList<>())
                        .temperature(0.5F)
                        .maxTokens(2000)
                        .topP(0.3F)
                        .frequencyPenalty(0.8F)
                        .presencePenalty(0.5F)
                        .build();
        request.getMessages().add(new Message("system", message.toString()));
        request.getMessages().add(new Message("user",questionRequestDto.getContent()));

        GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);

        // 답변 뱉어내기
        return QuestionResponseDto.builder()
                .content(chatGPTResponse.getChoices().get(0).getMessage().getContent())
                .build();
    }

    // 선생님의 요청 (이거 기반으로 대답해야함 ) DB에 저장하기
    public CommonResponseDto uploadNotice(NoticeRequestDto noticeRequestDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(()->new CustomException(ErrorCode.UserNotFoundException));
        Board board = boardRepository.findByBoardId(userDetails.getBoardId())
                .orElseThrow(() -> new CustomException(ErrorCode.BoardNotFoundException));

        chatbotRepository.save(ChatBot.builder()
                .board(board)
                .user(user)
                .content(noticeRequestDto.getContent())
                .startTime(noticeRequestDto.getStartTime())
                .endTime(noticeRequestDto.getEndTime())
                .build());
        return new CommonResponseDto("upload about notice to DB");
    }

    // 이미지 + 요청인 경우
    public CommonResponseDto uploadNoticeAndImage(ImageRequestDto imageRequestDto) {
        //이미지 입력 전 prompt 입력
        GPTImageNotice(imageRequestDto.getContent());
        //이미지 입력 후 요약 내용 얻기
        String output = uploadImage(imageRequestDto.getImage());
        //요약한 내용 DB에 저장
        uploadNotice(NoticeRequestDto.builder()
                .content(output+"\n"+imageRequestDto.getContent())
                .startTime(imageRequestDto.getStartTime())
                .endTime(imageRequestDto.getEndTime())
                .build());
        return new CommonResponseDto("교사 요청 사진 업로드 완");
    }


    // GPT에게 이미지 prompt 전달
    public void GPTImageNotice(String text) {
        GPTRequest request =
                GPTRequest.builder()
                        .model(model)
                        .messages(new ArrayList<>())
                        .temperature(0.5F)
                        .maxTokens(5000)
                        .topP(0.3F)
                        .frequencyPenalty(0.8F)
                        .presencePenalty(0.5F)
                        .build();
        request.getMessages().add(new Message("system", imageUploadPrompt(text)));
        GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);
    }
    // GPT에게 이미지 전달
    public String uploadImage(MultipartFile image) {
        String dataUrl = null;
        try{
            dataUrl = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(image.getBytes());
        } catch(Exception e) {
            throw new CustomException(ErrorCode.GPTError);
        }

        List<ImageUploadGPTRequest.Content> contents = new ArrayList<>();
        ImageUploadGPTRequest.Content content = new ImageUploadGPTRequest.Content();
        content.setType("image_url");
        content.setImage_url(ImageUploadGPTRequest.ImageUrl.builder().url(dataUrl).build());

//        CustomGPTRequest.Content text = new CustomGPTRequest.Content();
//        text.setType("text");
//        text.setText(prompt);

        contents.add(content);
//        contents.add(text);

        ImageUploadGPTRequest.Message message = ImageUploadGPTRequest.Message.builder()
                .role("user")
                .content(contents)
                .build();

        ImageUploadGPTRequest request = ImageUploadGPTRequest.builder()
                .model(model)
                .messages(List.of(message))
                .temperature(0.5F)
                .maxTokens(1000)
                .topP(0.3F)
                .frequencyPenalty(0.8F)
                .presencePenalty(0.5F)
                .build();

        GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);
        String imageUrl = s3ImageService.upload(image, "gptnotice");

        return chatGPTResponse.getChoices().get(0).getMessage().getContent();
    }
}