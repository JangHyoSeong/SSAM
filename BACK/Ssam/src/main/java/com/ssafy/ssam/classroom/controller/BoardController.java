package com.ssafy.ssam.classroom.controller;

import com.ssafy.ssam.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.classroom.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/classrooms")
public class BoardController {

    private final BoardService boardService;

    @Autowired
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

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
