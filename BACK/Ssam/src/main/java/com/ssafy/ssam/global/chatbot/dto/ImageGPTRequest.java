package com.ssafy.ssam.global.chatbot.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
@Builder
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ImageGPTRequest {

    private String model;
    private List<ImageMessage> messages;
    private float temperature;
    private int maxTokens;
    private float topP;
    private float frequencyPenalty;
    private float presencePenalty;

}