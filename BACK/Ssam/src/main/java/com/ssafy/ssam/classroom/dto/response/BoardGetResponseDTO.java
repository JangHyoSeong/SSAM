package com.ssafy.ssam.classroom.dto.response;

import com.ssafy.ssam.notification.entity.Question;
import com.ssafy.ssam.user.entity.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardGetResponseDTO {
    private int classId;
    private String pin;
    private String banner;
    private String bannerImg;
    private String notice;
    private int grade;
    private int classroom;
    private String consultUrl;

    // 학급에서 나타낼 유저, 질문을 위해 UserDTO, QuestionDTO 추가 필요
    // private List<UserDTO> users;
    // private List<QuestionDTO> questions;
}
