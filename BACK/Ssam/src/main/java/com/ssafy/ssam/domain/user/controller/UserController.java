package com.ssafy.ssam.domain.user.controller;

import com.ssafy.ssam.domain.user.dto.request.JoinRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/gen")
    public ResponseEntity<CommonResponseDto> userGenProcess(){
        return ResponseEntity.ok(joinService.userGenProcess());
    }
    
    
    @PostMapping("/students")
    public ResponseEntity<CommonResponseDto> studentJoinProcess(@Valid @RequestBody JoinRequestDto joinRequestDto){
        return ResponseEntity.ok(joinService.studentJoinProcess(joinRequestDto));
    }

    @PostMapping("/teachers")
    public ResponseEntity<CommonResponseDto> teacherJoinProcess(@Valid @RequestBody  JoinRequestDto joinRequestDto){
        return ResponseEntity.ok(joinService.teacherJoinProcess(joinRequestDto));
    }
    
}
