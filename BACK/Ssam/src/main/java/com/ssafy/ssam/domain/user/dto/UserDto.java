package com.ssafy.ssam.domain.user.dto;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.domain.user.entity.UserRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Builder
public class UserDto {
    private Integer userId;
    private String name;
    private String email;
    private String phone;
    private School school;
    private UserRole role;
    private List<Board> boards;
    private String imgUrl;
    private LocalDate birth;
    private String otherName;
    private String otherPhone;
    private String otherRelation;

    private String username;
    private String password;
    
    @Override
    public String toString() {
        return "UserDto [userId=" + userId + ", name=" + name + ", email=" + email + ", phone=" + phone + ", school=" + school + ", role=" + role + ", boards=" + boards + ", imgUrl=" + imgUrl + ", birth=" + birth + ", otherName=" + otherName + ", otherPhone=" + otherPhone + ", otherRelation=" + otherRelation + ", username=" + username + ", password=" + password + "]";
    }
}
