package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import com.ssafy.ssam.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AppointmentResponseDto {
    private Integer appointmentId;
    private Integer studentId;
    private Integer teacherId;
    private String topic;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AppointmentStatus status;
}
