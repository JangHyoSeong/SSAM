package com.ssafy.ssam.domain.classroom.entity;

import com.ssafy.ssam.domain.notification.entity.Question;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
@Builder
@Entity
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Integer boardId;

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

    @Column(nullable = false)
    private Integer is_deprecated;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<UserBoardRelation> userBoardRelations = new ArrayList<>();

}
