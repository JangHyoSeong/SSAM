package com.ssafy.ssam.global.chatbot.service;

import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.consult.service.ConsultService;
import com.ssafy.ssam.global.amazonS3.service.S3TextService;
import com.ssafy.ssam.global.chatbot.dto.GPTRequest;
import com.ssafy.ssam.global.chatbot.dto.GPTResponse;
import com.ssafy.ssam.global.chatbot.dto.Message;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GPTService {

    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiUrl;
    private final RestTemplate restTemplate;

    private final S3TextService s3TextService;
    private final ConsultRepository consultRepository;

    public String summaryConsult(Integer consultId, String topic) {
        String before = "When making a reservation, refer to the topic of "+topic+" entered by parents and classify the conversation received by STT / by speaker\n" +
                "Teachers should be able to see this file and see at a glance the important elements of the conversation they had with their parents. The output includes a lot of parents' concerns or mentioning a specific person, and includes minimal information about their daily lives.\n" +
                "The result shall be returned in Korean and in more than 150 characters in total\n" +
                "topic : [one of things attitude, bullying, career, friend, score, others]\n" +
                "keypoint: [] a one-line summary of the overall conversation\n" +
                "parent concern: [] Parental concerns\n" +
                "teacher referral: [] teacher's recommendation\n" +
                "follow up date: [If you have any comments on the following consultation, yy.mm .dd, if not, blank]";
        String sessionId = consultRepository.findByConsultId(consultId)
                .orElseThrow(()->new CustomException(ErrorCode.ConsultNotFountException)).getWebrtcSessionId();
        String talk = s3TextService.readText(sessionId);

        GPTRequest request =
                GPTRequest.builder()
                        .model(model)
                        .messages(new ArrayList<>())
                        .temperature(0.5F)
                        .maxTokens(500)
                        .topP(0.3F)
                        .frequencyPenalty(0.8F)
                        .presencePenalty(0.5F)
                        .build();
        request.getMessages().add(new Message("System", before));
        request.getMessages().add(new Message("User", talk));
        GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);

        return  chatGPTResponse.getChoices().get(0).getMessage().getContent();
    }

}