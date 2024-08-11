package com.ssafy.ssam.global.chatbot.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ssafy.ssam.global.chatbot.dto.CustomGPTRequest;
import com.ssafy.ssam.global.chatbot.dto.CustomGPTRequest.ImageUrl;
import com.ssafy.ssam.global.chatbot.dto.GPTResponse;
import com.ssafy.ssam.global.chatbot.dto.GPTResponse.Choice;
import com.ssafy.ssam.global.chatbot.dto.ImageRequestDto;
import com.ssafy.ssam.global.chatbot.dto.Message;
import com.ssafy.ssam.global.dto.CommonResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomGPTService {

    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public CommonResponseDto uploadImage(ImageRequestDto imageRequestDto) {
        CustomGPTRequest request = CustomGPTRequest.builder()
                .model(model)
                .messages(new ArrayList<>())
                .temperature(0.5F)
                .maxTokens(500)
                .topP(0.3F)
                .frequencyPenalty(0.8F)
                .presencePenalty(0.5F)
                .build();

        List<CustomGPTRequest.Content> contents = new ArrayList<>();

        contents.add(CustomGPTRequest.Content.builder()
                .type("image_url")
                .image_url(new ImageUrl("https://.s3..amazonaws.com/gptnotice/1919a90c-ba78-4150-84fc-eb2800cebceb-%ED%95%84%EC%A6%9D%EC%9E%85%EB%8B%88%EB%8B%A4.PNG"))
                //.text(imageRequestDto.getText())
                .build());
        
        /*
        // Add text prompt if provided
        if (imageRequestDto.getText() != null && !imageRequestDto.getText().isEmpty()) {
            contents.add(CustomGPTRequest.Content.builder()
                    .type("text")
                    //.text(imageRequestDto.getText())
                    .build());
        } else {
            // Default prompt if no text is provided
            contents.add(CustomGPTRequest.Content.builder()
                    .type("text")
                    .text("Give me all possible information in the picture in Korean without a summary.")
                    .build());
        }*/

        // Process image
        if (imageRequestDto.getImage() != null && !imageRequestDto.getImage().isEmpty()) {
            try {
                byte[] imageBytes = imageRequestDto.getImage().getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                String dataUrl = "data:image/jpeg;base64," + base64Image;

                contents.add(CustomGPTRequest.Content.builder()
                        .type("image_url")
                        .image_url(CustomGPTRequest.ImageUrl.builder()
                                .url(dataUrl)
                                .build())
                        .build());
            } catch (IOException e) {
                log.error("Error reading image file: {}", e.getMessage());
                //throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR);
            }
        } else {
            log.error("No image file provided");
            //throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR);
        }

        CustomGPTRequest.Message message = CustomGPTRequest.Message.builder()
                .role("user")
                .content(contents)
                .build();

        request.setMessages(List.of(message));
        GPTResponse chatGPTResponse = null;
        try {
        	chatGPTResponse = restTemplate.postForObject(apiUrl, request, GPTResponse.class);

        } catch(Exception e) {
        	System.out.println(e);
        }
        List<Choice> list = chatGPTResponse.getChoices();
        for(Choice c : list) {
        	System.out.println(c.getIndex());
        	Message m = c.getMessage();
        	System.out.println(m.getRole());
        	System.out.println(m.getContent());
        }
        
        // Process the response as needed
        // For now, we're just returning a success message
        return new CommonResponseDto("Image uploaded and processed successfully");
    }
}