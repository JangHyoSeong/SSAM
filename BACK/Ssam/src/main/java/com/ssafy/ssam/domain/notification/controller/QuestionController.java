package com.ssafy.ssam.domain.notification.controller;

import com.ssafy.ssam.domain.consult.service.ConsultService;
import com.ssafy.ssam.domain.notification.dto.request.QuestionRequestDto;
import com.ssafy.ssam.domain.notification.dto.response.QuestionResponseDto;
import com.ssafy.ssam.domain.notification.service.QuestionService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import com.ssafy.ssam.global.error.exception.BindingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Controller
@ResponseBody
@RequestMapping("/v1/classrooms")
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping("/questions/{boardId}")
    public ResponseEntity<List<QuestionResponseDto>> getQuestions(@PathVariable Integer boardId) {
        log.info("controller - getQuestions");
        return ResponseEntity.ok(questionService.getQuestions(boardId));
    }
    @PostMapping("/questions/{boardId}")
    public ResponseEntity<QuestionResponseDto> createQuestion(@PathVariable Integer boardId, @Valid @RequestBody QuestionRequestDto questionRequestDto) {
        log.info("controller - createQuestion");
        return ResponseEntity.ok(questionService.createQuestion(boardId, questionRequestDto));
    }
    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<CommonResponseDto> deleteQuestion(@PathVariable Integer questionId) {
        log.info("controller - deleteQuestion");
        return ResponseEntity.ok(questionService.deleteQuestion(questionId));
    }
}
