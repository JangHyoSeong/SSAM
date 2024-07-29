package com.ssafy.ssam.domain.classroom.controller;

import com.ssafy.ssam.domain.classroom.dto.request.BoardBannerImageRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.request.BoardBannerUpdateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.request.BoardNoticeUpdateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.service.BoardService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("v1/classrooms")
public class BoardController {

    private final BoardService boardService;

    // Post(학급 생성) 성공시 반환할 메세지. 수정 필요
    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping
    public ResponseEntity<BoardGetResponseDTO> createBoard(@Valid @RequestBody BoardCreateRequestDTO requestDTO) {
        return ResponseEntity.ok(boardService.createBoard(requestDTO));
    }

    // 학급 페이지 진입
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardGetResponseDTO> getBoard(@PathVariable Integer boardId) {

        BoardGetResponseDTO boardResponseDTO = boardService.getBoardById(boardId);
        return ResponseEntity.ok(boardResponseDTO);
    }

    // 학급 공지사항 수정
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/notice/{boardId}")
    public ResponseEntity<CommonResponseDto> changeNotice(
            @PathVariable Integer boardId,
            @Valid @RequestBody BoardNoticeUpdateRequestDTO requestDTO) {
        boardService.updateNotice(boardId, requestDTO.getNotice());
        CommonResponseDto res = new CommonResponseDto();
        return ResponseEntity.ok(res);
    }

    // 학급 배너 수정
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/banner/{boardId}")
    public ResponseEntity<CommonResponseDto> changeBanner(
            @PathVariable Integer boardId,
            @Valid @RequestBody BoardBannerUpdateRequestDTO requestDTO) {
        boardService.updateBanner(boardId, requestDTO.getBanner());
        CommonResponseDto res = new CommonResponseDto();
        return ResponseEntity.ok(res);
    }

    // 학급 pin번호 재발급
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("pin/{boardId}")
    public ResponseEntity<CommonResponseDto> refreshPin(@PathVariable Integer boardId) {
        boardService.refreshPin(boardId);
        CommonResponseDto res = new CommonResponseDto();
        return ResponseEntity.ok(res);
    }

    // 학급 배너 이미지 수정
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/banner-img/{boardId}")
    public ResponseEntity<CommonResponseDto> changeBannerImage(
            @PathVariable Integer boardId,
            @Valid @RequestBody BoardBannerImageRequestDTO request) {
        boardService.updateBannerImage(boardId, request.getBannerImage());
        CommonResponseDto res = new CommonResponseDto();
        return ResponseEntity.ok(res);
    }

}
