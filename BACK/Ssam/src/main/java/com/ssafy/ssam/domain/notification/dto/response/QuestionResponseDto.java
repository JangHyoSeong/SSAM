package com.ssafy.ssam.domain.notification.dto.response;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDto {
    private Integer questionId;
    @NotNull(message = "질문자는 null일 수 없습니다")
    private Integer studentId;
    @NotNull(message = "학급은 null일 수 없습니다")
    private Integer boardId;

    @Size(min = 1, max = 50, message = "1자이상 50자 이하로 입력해야합니다")
    private String content;

    private String answer;

    @NotNull(message = "질문시간은 null일 수 없습니다")
    private LocalDateTime contentDate;
    private LocalDateTime answerDate;
}
