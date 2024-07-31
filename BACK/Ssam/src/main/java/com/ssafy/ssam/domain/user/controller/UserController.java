package com.ssafy.ssam.domain.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ssafy.ssam.domain.user.dto.UserDto;
import com.ssafy.ssam.domain.user.service.UserService;
import com.ssafy.ssam.global.dto.CommonResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@ResponseBody
@RequestMapping("/v1/auth")
public class UserController {
    private final UserService joinService;

    @PostMapping("/students")
    public ResponseEntity<CommonResponseDto> studentJoinProcess(@Valid @RequestBody UserDto userDto){
        return ResponseEntity.ok(joinService.studentJoinProcess(userDto));
    }

    @PostMapping("/teachers")
    public ResponseEntity<CommonResponseDto> teacherJoinProcess(@Valid @RequestBody UserDto userDto){
        return ResponseEntity.ok(joinService.teacherJoinProcess(userDto));
    }
    
}
