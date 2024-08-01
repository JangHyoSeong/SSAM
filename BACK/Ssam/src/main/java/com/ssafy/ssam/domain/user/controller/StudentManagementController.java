package com.ssafy.ssam.domain.user.controller;

import com.amazonaws.Response;
import com.ssafy.ssam.domain.user.dto.response.StudentRegistInfoDTO;
import com.ssafy.ssam.domain.user.service.StudentManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("v1/classrooms/teachers/students")
public class StudentManagementController {

    private final StudentManagementService studentManagementService;

    @GetMapping()
    public ResponseEntity<List<StudentRegistInfoDTO>> getRegistRequestList() {
        return ResponseEntity.ok(studentManagementService.getRegistRequestList());
    }
}
