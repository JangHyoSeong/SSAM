package com.ssafy.ssam.global.chatbot.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;
import org.checkerframework.checker.units.qual.A;

@Builder
@Setter
@Getter
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ImageUrl {
    private String url;
}
