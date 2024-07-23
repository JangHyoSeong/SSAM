package com.ssafy.ssam.domain.notification.entity;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @NotNull
    @Column(length = 50, nullable = false)
    private String content;

    @Column
    private String answer;

    @NotNull
    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "content_date", columnDefinition = "TIMESTAMP", nullable = false)
    private LocalDateTime contentDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "answer_date", columnDefinition = "TIMESTAMP")
    private LocalDateTime answerDate;

}
