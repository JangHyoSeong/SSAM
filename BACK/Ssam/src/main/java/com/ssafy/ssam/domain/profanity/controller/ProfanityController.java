package com.ssafy.ssam.domain.profanity.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ssam.domain.profanity.dto.MessageRequest;
import com.ssafy.ssam.domain.profanity.dto.ProfanityResponse;
import com.ssafy.ssam.domain.profanity.service.ProfanityService;

@RestController
@RequestMapping("/v1/profanity")
public class ProfanityController {

    @Autowired
    private ProfanityService profanityService;

    @PostMapping("/check")
    public ProfanityResponse checkProfanity(@RequestBody MessageRequest request) {
        return profanityService.detectProfanity(request.getMessage());
    }
}