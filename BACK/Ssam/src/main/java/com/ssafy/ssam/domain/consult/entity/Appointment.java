package com.ssafy.ssam.domain.consult.entity;

import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
@Setter
@Builder
@DynamicInsert // 애초에 날릴때 null은 배제하고 날려야 default값이 입력된다. 그래서 배제하도록 해주는 어노테이션
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(length = 50)
    private String topic;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time", columnDefinition = "TIMESTAMP",nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'BEFORE'") // default 값 설정
    private AppointmentStatus status;

    public static Appointment toAppointment(User student, User teacher, AppointmentRequestDto appointmentRequestDto){
        return Appointment.builder()
                .teacher(teacher)
                .student(student)
                .topic(appointmentRequestDto.getTopic())
                .startTime(appointmentRequestDto.getStartTime())
                .endTime(appointmentRequestDto.getEndTime())
                .build();
    }
    public static AppointmentResponseDto toAppointmentDto(Appointment appointment){
        return AppointmentResponseDto.builder()
                .studentId(appointment.getStudent().getUserId())
                .teacherId(appointment.getTeacher().getUserId())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .topic(appointment.getTopic())
                .status(appointment.getStatus())
                .build();
    }
}
