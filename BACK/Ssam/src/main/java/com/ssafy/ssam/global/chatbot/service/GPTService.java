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
import java.time.LocalDateTime;
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

    public SummaryRequestDto GPTsummaryConsult(String talk, String topic, LocalDateTime time) {
        String before = "At that time \"20240809\".\n" +
                "When making a reservation, refer to the topic of \"+topic+\" entered by parents and classify the conversation received by STT\n" +
                "Teachers should be able to see this file and see at a glance the important elements of the conversation they had with their parents. The output includes a lot of parents' concerns or mentioning a specific person, and includes minimal information about their daily lives.\n" +
                "Also, if you are open to criticism with aggressive language towards the teacher or if there is a word for the purpose of slander, please count and fill the level of the entire conversation\n" +
                "When the stages of verbal abuse are divided into 0 to 5\n" +
                "Level 0: Normal Conversation\n" +
                "Words and expressions: language with respect and courtesy\n" +
                "Examples: \"OK,\" \"Thank you,\" \"I have a question.\"\n" +
                "Level 1: Growing complaints from parents, flippers to protect their child\n" +
                "Words and expressions: words that express some dissatisfaction\n" +
                "Examples: \"It's kind of weird,\" \"I disagree,\" \"My kid's not the type to do that.\" \"I'm disappointed in the teacher,\" \"I don't understand,\" \"It's unfair.\"\n" +
                "\"Didn't you get it wrong?\"\n" +
                "Level 3: Serious complaints and tension\n" +
                "Words and expressions: words that may include personal attacks, stronger signs of dissatisfaction, and remarks that ignore the teacher's experience\n" +
                "a rude conversation in which the language of the teacher refers to you, etc\n" +
                "the act of scaring one's superiors\n" +
                "Examples: \"I'm not responsible,\" \"It's a mistake,\" \"I suspect professionalism,\" \"Bring in.\" \"Even if you're a teacher, this is a home education.\"\n" +
                "\"Who is my father?\" \"Do you know the principal or the scholar?\"\n" +
                "\"That's why~\"\n" +
                "Level 5: Severe verbal abuse, including aggressive and accusatory words, warnings and threats\n" +
                "Words and expressions: swearing, grossly offensive language, extreme criticism and intimidation\n" +
                "Examples: \"Fuck\" \"Get off,\" \"Trash,\" \"Bitch like you,\" \"Incompetent,\" \"Sick.\"\n" +
                ", 'out of my sight.' 'Get rid of the nonsense.'\n" +
                "divide by etc\n" +
                "The results are more than 150 characters in Korean. At this time, if there are multiple contents in one result value, it is not a list, so don't use '[', ']', only availble a \",\" and provides one result.\n" +
                "And json types\n" +
                "요약 :  A one-line summary of the entire conversation\n" +
                "부모 우려: \n" +
                "교사 추천: \n" +
                "후속 예약날짜: yyyymmdd, If there is no follow-up reservation date, blank\n" +
                "욕설 횟수: count number\n" +
                "욕설 수준: Total level just Integer";

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
        request.getMessages().add(new Message("system", before));
        request.getMessages().add(new Message("user", talk));
        GPTResponse chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);

        return jsonToSummaryRequest(chatGPTResponse.getChoices().get(0).getMessage().getContent());
    }
    public SummaryRequestDto jsonToSummaryRequest(String gptAnswer) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            if (gptAnswer.startsWith("```json\n") && gptAnswer.endsWith("```")) {
                gptAnswer = gptAnswer.substring(8, gptAnswer.length() - 3);
            }
            JsonNode jsonNode = objectMapper.readTree(gptAnswer);
//            log.info("{}" , jsonNode.get("요약").asText());
//            log.info("{}" , jsonNode.get("부모 우려").asText());
//            log.info("{}" , jsonNode.get("교사 추천").asText());
//            log.info("{}" , jsonNode.get("욕설 횟수").asText());
//            log.info("{}" , jsonNode.get("욕설 수준").asText());

            return SummaryRequestDto.builder()
                    .keyPoint(jsonNode.get("요약").asText())
                    .parentConcern(jsonNode.get("부모 우려").asText())
                    .teacherRecommendation(jsonNode.get("교사 추천").asText())
                    .profanityLevel(jsonNode.get("욕설 횟수").asText())
                    .profanityCount(Integer.parseInt(jsonNode.get("욕설 수준").asText()))
                    .build();

        } catch (JsonProcessingException e) {
            log.error("Error parsing GPT response JSON: {}", e.getMessage());
            return null;
        }
    }
}