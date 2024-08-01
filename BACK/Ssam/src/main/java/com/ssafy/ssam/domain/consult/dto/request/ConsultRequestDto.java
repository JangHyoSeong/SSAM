package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.ConsultTopic;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultRequestDto {
    private Integer consultId;
    @NotNull
    private Appointment appointment;
    @NotNull
    private LocalDate actualDate;
    private String content;
    private String videoUrl;
    private ConsultTopic topic;
    private String webrtcSessionId;
    private String accessCode;
}
