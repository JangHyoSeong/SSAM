package com.ssafy.ssam.domain.user.dto.request;

import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.classroom.entity.School;
import com.ssafy.ssam.domain.user.entity.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@Setter
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public class JoinRequestDto {
    @NotNull
    private String name;
    @NotNull
    private String email;
    @NotNull
    private String phone;
    @NotNull
    private LocalDate birth;

    @NotNull
    private String username;
    @NotNull
    private String password;


    private Integer schoolId;
    private String otherName;
    private String otherPhone;
    private String otherRelation;

}
