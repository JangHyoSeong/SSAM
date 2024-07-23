package com.ssafy.ssam.classroom.entity;

import com.ssafy.ssam.classroom.converter.ManageStatusConverter;
import com.ssafy.ssam.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Manage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Integer followId;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @NotNull
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "follow_date", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime followDate;

//    @Convert(converter = ManageStatusConverter.class)
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ManageStatus status;

    public enum ManageStatus {
        WAITING,
        ACCEPTED,
        BLOCKED
    }

}