package com.ssafy.ssam.global.chatbot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Setter
@Getter
@Builder
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GPTRequest {

    private String model;
    private List<Message> messages;
    private float temperature;
    private int maxTokens;
    private float topP;
    private float frequencyPenalty;
    private float presencePenalty;

}