package com.ssafy.ssam.domain.classroom.controller;

import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.service.BoardService;
import com.ssafy.ssam.global.error.ErrorCode;
import com.ssafy.ssam.global.error.exception.BindingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/classrooms")
public class BoardController {

    private final BoardService boardService;

    // Post(학급 생성) 성공시 반환할 메세지. 수정 필요
//    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/teachers")
    public ResponseEntity<BoardGetResponseDTO> createBoard(@Valid @RequestBody BoardCreateRequestDTO responseDTO,
                                                           BindingResult bindingResult) {
        log.info(responseDTO.getGrade()+" 확인");
        log.info(responseDTO.getClassroom()+" 확인");
        if(bindingResult.hasErrors()) throw new BindingException(ErrorCode.BINDING_ERROR, Objects.requireNonNull(bindingResult.getFieldError()).getDefaultMessage());
        return ResponseEntity.ok(boardService.createBoard(responseDTO));
    }

    // 학급 페이지 진입
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardGetResponseDTO> getBoard(@PathVariable int boardId) {
        BoardGetResponseDTO boardResponseDTO = boardService.getBoardById(boardId);
        return ResponseEntity.ok(boardResponseDTO);
    }

}
