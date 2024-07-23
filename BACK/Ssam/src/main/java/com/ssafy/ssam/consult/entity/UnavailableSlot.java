package com.ssafy.ssam.consult.entity;

import com.ssafy.ssam.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "unavailable_slot")
public class UnavailableSlot{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unavailable_slot_id")
    private int unavailableSlotId;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time", columnDefinition = "TIMESTAMP",nullable = false)
    private Timestamp startTime;

    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time", columnDefinition = "TIMESTAMP", nullable = false)
    private Timestamp endTime;

}
