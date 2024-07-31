package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.ConsultTopic;
import com.ssafy.ssam.domain.user.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

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
