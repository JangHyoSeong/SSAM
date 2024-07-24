package com.ssafy.ssam.domain.user.controller;

import com.ssafy.ssam.domain.user.dto.UserDto;
import com.ssafy.ssam.domain.user.service.JoinService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RequiredArgsConstructor
@Controller
@ResponseBody
@RequestMapping("api/v1/auth")
public class JoinController{
    private final JoinService joinService;

    @PostMapping("/students")
    public ResponseEntity<CommonResponseDto> studentJoinProcess(UserDto userDto){
        return ResponseEntity.ok(joinService.studentJoinProcess(userDto));
    }

    @PostMapping("/teachers")
    public ResponseEntity<CommonResponseDto> teacherJoinProcess(UserDto userDto){
        return ResponseEntity.ok(joinService.teacherJoinProcess(userDto));
    }
}
