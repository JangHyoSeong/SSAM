package com.ssafy.ssam.classroom.entity;

import com.ssafy.ssam.notification.entity.Question;
import com.ssafy.ssam.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Builder
@Entity
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Integer classId;

    @NotNull
    @Column(unique = true, nullable = false, length = 6)
    private String pin;

    @Column
    private String banner;

    @Column(name = "banner_img")
    private String bannerImg;

    @Column(columnDefinition = "TEXT")
    private String notice;

    @NotNull
    @Column(columnDefinition = "TINYINT CHECK (grade BETWEEN 1 AND 6)", nullable = false)
    private Integer grade;

    @NotNull
    @Column(columnDefinition = "TINYINT", nullable = false)
    private Integer classroom;

    @Column(name = "consult_url")
    private String consultUrl;

    // Board와 User 관계 매핑
    // board가 어떤 user(teacher)와 연결되어있는지 나타냄
    @ManyToMany(mappedBy = "boards")
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<Question> questions = new ArrayList<>();

}
