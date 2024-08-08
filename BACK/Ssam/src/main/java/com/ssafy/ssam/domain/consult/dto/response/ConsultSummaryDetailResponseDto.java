package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.Consult;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ConsultSummaryDetailResponseDto {

    private Integer consultId;
    private LocalDateTime actualDate;
    private Integer runningTime;

    private String keyPoint;
    private int profanityCount;
    private String profanityLevel;
    private String parentConcern;
    private String teacherRecommendation;
    private LocalDate followUpDate;

    private Integer studentId;
    private Integer attSchool;
    private Integer attGrade;
    private Integer attClassroom;

    private String content;

}
