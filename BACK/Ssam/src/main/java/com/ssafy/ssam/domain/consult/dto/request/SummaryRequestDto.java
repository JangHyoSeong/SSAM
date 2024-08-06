package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.consult.entity.Consult;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SummaryRequestDto {
    private Integer summaryId;
    private Consult consult;
    private String topic;
    private String keyPoint;
    private int profanityCount;
    private String profanityLevel;
    private String parentConcern;
    private String teacherRecommendation;
    private Date followUpDate;
}
