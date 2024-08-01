package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.ConsultTopic;

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
public class ConsultRequestDto {
    private Integer consultId;
    private Appointment appointment;
    private Date actualDate;
    private String content;
    private String videoUrl;
    private ConsultTopic topic;
    private String webrtcSessionId;
    private String accessCode;
}
