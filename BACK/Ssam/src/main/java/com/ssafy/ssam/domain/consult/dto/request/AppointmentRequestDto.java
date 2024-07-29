package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import com.ssafy.ssam.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.StringJoiner;

@Getter
@Setter
@Builder
public class AppointmentRequestDto {
    private Integer studentId;
    private String topic;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Override
    public String toString() {
        return this.studentId+" "+this.topic+" "+this.startTime+" "+this.endTime;
    }
}
