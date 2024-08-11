package com.ssafy.ssam.global.chatbot.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssam.global.amazonS3.service.S3ImageService;
import com.ssafy.ssam.global.chatbot.dto.ImageRequestDto;
import com.ssafy.ssam.global.chatbot.service.CustomGPTService;
import com.ssafy.ssam.global.chatbot.service.GPTService;
import com.ssafy.ssam.global.dto.CommonResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/gpt")
@RequiredArgsConstructor
public class GPTController {
    private static final Logger log = LoggerFactory.getLogger(GPTController.class);
    private final S3ImageService s3ImageService;
    private final GPTService gptService;
    private final CustomGPTService customGPTService;

    @PostMapping("/teachers")
    public ResponseEntity<CommonResponseDto> uploadImage(ImageRequestDto imageRequestDto) {
        if(!imageRequestDto.getImage().isEmpty()) return ResponseEntity.ok(gptService.uploadImage(imageRequestDto));
        else return ResponseEntity.ok(new CommonResponseDto("ok"));
    }
    
    @PostMapping("/teachers2")
    public ResponseEntity<CommonResponseDto> uploadImage2(ImageRequestDto imageRequestDto) {
        if(!imageRequestDto.getImage().isEmpty()) return ResponseEntity.ok(customGPTService.uploadImage(imageRequestDto));
        else return ResponseEntity.ok(new CommonResponseDto("ok"));
    }
    

}