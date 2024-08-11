package com.ssafy.ssam.global.chatbot.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

@Setter
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class Content {
    private String type;
    private String text; // For type "text"
    private ImageUrl imageUrl; // For type "image_url"

    public Content(String type, String text){
        this.type = type;
        this.text = text;
    }

    public Content(String type, ImageUrl imageUrl){
        this.type = type;
        this.imageUrl = imageUrl;
    }
}