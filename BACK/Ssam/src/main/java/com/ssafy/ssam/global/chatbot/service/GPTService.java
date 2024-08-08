package com.ssafy.ssam.global.chatbot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.ssam.domain.consult.dto.request.SummaryRequestDto;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.consult.service.ConsultService;
import com.ssafy.ssam.global.amazonS3.service.S3TextService;
import com.ssafy.ssam.global.chatbot.dto.GPTRequest;
import com.ssafy.ssam.global.chatbot.dto.GPTResponse;
import com.ssafy.ssam.global.chatbot.dto.Message;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
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

    public SummaryRequestDto GPTsummaryConsult(String talk , String topic) {
        String before = "When making a reservation, refer to the topic of "+topic+" entered by parents and classify the conversation received by STT\n" +
                "Teachers should be able to see this file and see at a glance the important elements of the conversation they had with their parents. The output includes a lot of parents' concerns or mentioning a specific person, and includes minimal information about their daily lives.\n" +
                "The result shall be returned in Korean and in more than 150 characters in total\n" +
                "topic : [one of things attitude, bullying, career, friend, score, others]\n" +
                "keypoint: [] a one-line summary of the overall conversation\n" +
                "parent concern: [] Parental concerns\n" +
                "teacher referral: [] teacher's recommendation\n" +
                "follow up date: [If you have any comments on the following consultation, yy.mm .dd, if not, blank]";

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

        return jsonToSummaryRequest(chatGPTResponse.getChoices().get(0).getMessage().getContent());
    }
    public SummaryRequestDto jsonToSummaryRequest(String gptAnswer) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(gptAnswer);

            return SummaryRequestDto.builder()
                    .keyPoint(jsonNode.get("요약").asText())
                    .parentConcern(jsonNode.get("부모의 우려").asText())
                    .teacherRecommendation(jsonNode.get("교사 추천").asText())
                    .profanityLevel(jsonNode.get("욕설 수준").asText())
                    .profanityCount(Integer.parseInt(jsonNode.get("욕설 수치").asText()))
                    .build();

        } catch (JsonProcessingException e) {
            log.error("Error parsing GPT response JSON: {}", e.getMessage());
            return null;
        }
    }
}