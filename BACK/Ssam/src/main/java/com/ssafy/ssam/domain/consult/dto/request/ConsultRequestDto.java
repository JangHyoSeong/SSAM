package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.AppointmentTopic;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultRequestDto {
    private Integer consultId;
    @NotNull
    private Integer appointmentId;
    @NotNull
    private LocalDateTime actualDate;
    private String content;
    private String videoUrl;
    private String webrtcSessionId;
    private String accessCode;
}
