package com.ssafy.ssam.domain.consult.dto.request;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.entity.UserRole;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.StringJoiner;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequestDto {
    @NotNull(message = "신청하는 사람은 Null 일 수 없습니다!")
    private Integer studentId;
    @Size(max = 50, message = "50자 이상은 입력받을 수 없습니다")
    private String topic;
    @NotNull(message = "시작시간은 Null 일 수 없습니다!")
    private LocalDateTime startTime;
    @NotNull(message = "종료시간은 Null 일 수 없습니다!")
    private LocalDateTime endTime;

    @Override
    public String toString() {
        return this.studentId+" "+this.topic+" "+this.startTime+" "+this.endTime;
    }
}
