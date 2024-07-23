package com.ssafy.ssam.notification.entity;

import com.ssafy.ssam.notification.converter.AlarmTypeConverter;
import com.ssafy.ssam.user.entity.User;
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
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private Integer alarmId;

//    @Convert(converter = AlarmTypeConverter.class)
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "alarm_type", nullable = false)
    private AlarmType alarmType;

    public enum AlarmType {
        ANSWER,
        QUESTION,
        REGISTRATION,
        ACCEPT
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @Column(nullable = false, columnDefinition = "TINYINT(1)")
    private Integer state;

    @NotNull
    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "alarm_time", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime alarmTime;
}
