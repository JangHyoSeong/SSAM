package com.ssafy.ssam.domain.notification.dto.request;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.notification.repository.QuestionRepository;
import com.ssafy.ssam.domain.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class QuestionRequestDto {
    @NotNull(message = "질문자는 null일 수 없습니다")
    private Integer studentId;
    @NotNull(message = "학급은 null일 수 없습니다")
    private Integer boardId;
    @Size(min = 1, max = 50, message = "1자이상 50자 이하로 입력해야합니다")
    private String content;
}
