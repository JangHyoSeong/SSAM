package com.ssafy.ssam.domain.user.controller;

import com.ssafy.ssam.domain.user.dto.response.StudentInfoDetailDTO;
import com.ssafy.ssam.domain.user.dto.response.StudentRegistInfoDTO;
import com.ssafy.ssam.domain.user.service.UserBoardRelationService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("v1/classrooms/teachers/students")
public class UserBoardRelationController {

    private final UserBoardRelationService userBoardRelationService;

    // 학급에 보낸 등록 요청을 확인하는 컨트롤러
    @GetMapping()
    public ResponseEntity<List<StudentRegistInfoDTO>> getRegistRequestList() {
        return ResponseEntity.ok(userBoardRelationService.getRegistRequestList());
    }

    // 학급 등록 요청을 수락하는 컨트롤러
    @PutMapping("/{studentId}/approve")
    public ResponseEntity<CommonResponseDto> approveRegist(@PathVariable Integer studentId) {
        return ResponseEntity.ok(userBoardRelationService.approveRegist(studentId));
    }
    
    // 학급 등록 요청을 거절하는 컨트롤러
    @PutMapping("/{studentId}/reject")
    public ResponseEntity<CommonResponseDto> rejectRegist(@PathVariable Integer studentId) {
        return ResponseEntity.ok(userBoardRelationService.rejectRegist(studentId));
    }

    // 학생 정보 열람
    @GetMapping("/{studentId}")
    public ResponseEntity<StudentInfoDetailDTO> getStudentDetail (@PathVariable Integer studentId) {
        return ResponseEntity.ok(userBoardRelationService.getStudentDetail(studentId));
    }

}
