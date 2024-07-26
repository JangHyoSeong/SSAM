package com.ssafy.ssam.domain.classroom.controller;

import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/classrooms")
public class BoardController {

    private final BoardService boardService;

    // Post(학급 생성) 성공시 반환할 메세지. 수정 필요
    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping
    public ResponseEntity<BoardGetResponseDTO> createBoard(@Valid @RequestBody BoardGetResponseDTO responseDTO) {
        return ResponseEntity.ok(boardService.createBoard(responseDTO));
    }

    // 학급 페이지 진입
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardGetResponseDTO> getBoard(@PathVariable int boardId) {
        BoardGetResponseDTO boardResponseDTO = boardService.getBoardById(boardId);
        return ResponseEntity.ok(boardResponseDTO);
    }

}
