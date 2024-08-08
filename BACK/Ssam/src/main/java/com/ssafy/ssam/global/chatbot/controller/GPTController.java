package com.ssafy.ssam.global.chatbot.controller;

import com.ssafy.ssam.global.chatbot.dto.GPTRequest;
import com.ssafy.ssam.global.chatbot.dto.GPTResponse;
import com.ssafy.ssam.global.chatbot.service.GPTService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/consults/teachers/summary")
@RequiredArgsConstructor
public class GPTController {
    private final GPTService gptService;

    @GetMapping("/{consultId}")
    public String createSummary(Integer consultId, String topic) {
        return gptService.summaryConsult(consultId, topic);
    }

//    @GetMapping("/chat")
//    public String chat(@RequestParam() String talk , String topic) {
//        return gptService.summaryConsult(talk , topic);
//    }
}