package com.ssafy.ssam.domain.consult.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "summary")
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Integer summaryId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "consult_id", nullable = false)
    private Consult consult;

    @NotNull
    @Column(name = "key_point", nullable = false)
    private String keyPoint;

    @NotNull
    @Column(name = "profanity_count", nullable = false)
    private int profanityCount;


    @Column(name = "profanity_level", nullable = false, length = 10)
    private String profanityLevel;

    @Column(name = "parent_concern", columnDefinition = "TEXT")
    private String parentConcern;

    @Column(name = "teacher_recommendation", columnDefinition = "TEXT")
    private String teacherRecommendation;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "follow_up_date", columnDefinition = "TIMESTAMP")
    private Date followUpDate;
}
