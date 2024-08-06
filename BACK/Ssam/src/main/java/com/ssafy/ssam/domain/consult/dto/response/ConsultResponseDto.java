package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class ConsultResponseDto {
    private Integer consultId;
    private Appointment appointment;
    private Date actualDate;
    private Integer runningTime;
    private String content;
    private String videoUrl;
    private String webrtcSessionId;
    private String accessCode;
    private Integer attSchool;
    private Integer attGrade;
    private Integer attClassroom;

}
