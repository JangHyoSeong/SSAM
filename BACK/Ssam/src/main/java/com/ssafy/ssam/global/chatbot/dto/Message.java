package com.ssafy.ssam.global.chatbot.dto;

import lombok.*;

@RequiredArgsConstructor
@Setter
@Getter
@Builder
@AllArgsConstructor
public class Message {

    private String role;
    private String content;
    
}