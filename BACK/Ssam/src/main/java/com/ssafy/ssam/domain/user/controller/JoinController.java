package com.ssafy.ssam.domain.user.controller;

import com.ssafy.ssam.domain.user.dto.UserDto;
import com.ssafy.ssam.domain.user.service.JoinService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RequiredArgsConstructor
@Controller
@ResponseBody
public class JoinController{
    private final JoinService joinService;

    @PostMapping("/auth/students")
    public ResponseEntity<CommonResponseDto> studentJoinProcess(UserDto userDto){
        return ResponseEntity.ok(joinService.studentJoinProcess(userDto));
    }

    @PostMapping("/auth/teachers")
    public ResponseEntity<CommonResponseDto> teacherJoinProcess(UserDto userDto){
        return ResponseEntity.ok(joinService.teacherJoinProcess(userDto));
    }
}
