package com.ssafy.ssam.domain.notification.dto.response;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

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
