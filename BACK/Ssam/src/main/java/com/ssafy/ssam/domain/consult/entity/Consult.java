package com.ssafy.ssam.domain.consult.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Consult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consult_id")
    private Integer consultId;

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "actual_date", columnDefinition = "TIMESTAMP")
    private LocalDateTime actualDate;

    @NotNull
    @Column(name = "running_time")
    private Integer runningTime;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "video_url")
    private String videoUrl;

    @Enumerated(EnumType.STRING)
    private ConsultTopic topic;



    @Column(name = "webrtc_session_id", length = 100)
    private String webrtcSessionId;

    @Column(name = "access_code")
    private String accessCode;

    @Column(name = "att_school")
    private Integer attSchool;

    @Column(name = "att_grade", columnDefinition = "TINYINT")
    private Integer attGrade;

    @Column(name = "att_classroom", columnDefinition = "TINYINT")
    private Integer attClassroom;

}
