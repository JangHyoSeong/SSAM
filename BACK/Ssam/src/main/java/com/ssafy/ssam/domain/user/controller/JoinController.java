package com.ssafy.ssam.domain.user.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ssafy.ssam.domain.user.dto.UserDto;
import com.ssafy.ssam.domain.user.service.JoinService;
import com.ssafy.ssam.global.dto.CommonResponseDto;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@ResponseBody
@RequestMapping("/v1/auth")
public class JoinController{
    private final JoinService joinService;
    private static final Logger logger = LoggerFactory.getLogger(JoinController.class);

    @GetMapping("/test")
    public ResponseEntity<CommonResponseDto> testProcess(){
    	logger.info("TEST");
    	return ResponseEntity.ok(null);
    }
    
    @PostMapping("/students")
    public ResponseEntity<CommonResponseDto> studentJoinProcess(@RequestBody UserDto userDto){
    	System.out.println("Dsadsads");
        return ResponseEntity.ok(joinService.studentJoinProcess(userDto));
    }

    @PostMapping("/teachers")
    public ResponseEntity<CommonResponseDto> teacherJoinProcess(UserDto userDto){
        return ResponseEntity.ok(joinService.teacherJoinProcess(userDto));
    }
}
