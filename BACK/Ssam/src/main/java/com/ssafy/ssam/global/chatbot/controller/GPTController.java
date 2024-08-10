package com.ssafy.ssam.global.chatbot.controller;

import com.ssafy.ssam.global.amazonS3.service.S3ImageService;
import com.ssafy.ssam.global.amazonS3.service.S3TextService;
import com.ssafy.ssam.global.chatbot.dto.GPTRequest;
import com.ssafy.ssam.global.chatbot.dto.GPTResponse;
import com.ssafy.ssam.global.chatbot.service.GPTService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/gpt")
@RequiredArgsConstructor
public class GPTController {
    private final S3ImageService s3ImageService;
    private final GPTService gptService;

    @PostMapping("/uploadImage")
    public ResponseEntity<CommonResponseDto> uploadImage(@RequestBody MultipartFile image) {
        String url = s3ImageService.upload(image, "gptnotice");
        gptService.uploadImage(url);
        return ResponseEntity.ok(new CommonResponseDto("ok"));
    }

}