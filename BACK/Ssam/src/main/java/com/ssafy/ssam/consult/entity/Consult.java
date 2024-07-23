package com.ssafy.ssam.consult.entity;

import com.ssafy.ssam.consult.converter.ConsultTopicConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Consult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consult_id")
    private int consultId;

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "actual_date", columnDefinition = "TIMESTAMP")
    private Date actualDate;

    @NotNull
    @Column(name = "running_time", nullable = false)
    private int runningTime;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "video_url")
    private String videoUrl;

//    @Convert(converter = ConsultTopicConverter.class)
    @Enumerated(EnumType.STRING)
    private ConsultTopic topic;

    public enum ConsultTopic {
        FRIEND,
        BULLYING,
        SCORE,
        CAREER,
        ATTITUDE,
        OTHER
    }

    @Column(name = "webrtc_session_id", length = 100)
    private String webrtcSessionId;

    @Column(name = "access_code")
    private String accessCode;

    @Column(name = "att_school")
    private int attSchool;

    @Column(name = "att_grade", columnDefinition = "TINYINT")
    private int attGrade;

    @Column(name = "att_classroom", columnDefinition = "TINYINT")
    private int attClassroom;

}
