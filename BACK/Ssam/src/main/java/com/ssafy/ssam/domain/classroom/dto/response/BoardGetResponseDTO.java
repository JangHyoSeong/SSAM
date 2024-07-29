package com.ssafy.ssam.domain.classroom.dto.response;

import com.ssafy.ssam.domain.notification.entity.Question;
import com.ssafy.ssam.domain.user.entity.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardGetResponseDTO {
    private Integer classId;
    private String pin;
    private String banner;
    private String bannerImg;
    private String notice;
    private Integer grade;
    private Integer classroom;
    private String consultUrl;

    // 학급에서 나타낼 유저, 질문을 위해 UserDTO, QuestionDTO 추가 필요
    // private List<UserDTO> users;
    // private List<QuestionDTO> questions;
}
