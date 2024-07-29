package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.Consult;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class SummaryResponseDto {
    private Integer summaryId;
    private Consult consult;
    private String keyPoint;
    private int profanityCount;
    private String profanityLevel;
    private String parentConcern;
    private String teacherRecommendation;
    private Date followUpDate;
}
