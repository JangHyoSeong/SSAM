package com.ssafy.ssam.domain.consult.controller;

import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.consult.dto.response.ConsultResponseDto;
import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import com.ssafy.ssam.domain.consult.service.ConsultService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.units.qual.C;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/consults")
public class ConsultController {
    private final ConsultService consultService;

    @GetMapping("/teachers/{consultId}")
    public ResponseEntity<ConsultSummaryDetailResponseDto> getConsults(@PathVariable Integer consultId) {
        return ResponseEntity.ok(consultService.getConsultsAndSummaryDetails(consultId));
    }

    @GetMapping("/test")
    public ResponseEntity<CommonResponseDto> test(@PathVariable String consultId) {
        return ResponseEntity.ok(new CommonResponseDto("ok"));
    }
//    @PutMapping("/teachers/{consultId}")
//    public ResponseEntity<ConsultSummaryDetailResponseDto> updateConsults(@PathVariable Integer consultId) {
//        return ResponseEntity.ok(consultService.updateConsultsAndSummaryDetails(consultId));
//    }

}
