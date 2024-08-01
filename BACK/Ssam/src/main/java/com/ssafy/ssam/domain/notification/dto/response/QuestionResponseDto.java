package com.ssafy.ssam.domain.notification.dto.response;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
@Builder
public class QuestionResponseDto {

    private Integer questionId;
    private Integer studentId;
    private Integer boardId;

    private String content;

    private String answer;

    private LocalDateTime contentDate;
    private LocalDateTime answerDate;
}
