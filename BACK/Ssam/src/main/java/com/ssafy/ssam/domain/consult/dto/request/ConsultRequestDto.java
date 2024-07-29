package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.ConsultTopic;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@Builder
public class ConsultRequestDto {
    private Integer consultId;
    private Appointment appointment;
    private Date actualDate;
    private Integer runningTime;
    private String content;
    private String videoUrl;
    private ConsultTopic topic;
    private String webrtcSessionId;
    private String accessCode;
    private Integer attSchool;
    private Integer attGrade;
    private Integer attClassroom;

}
