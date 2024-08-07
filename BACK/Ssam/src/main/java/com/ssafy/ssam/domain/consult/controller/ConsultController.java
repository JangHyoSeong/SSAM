package com.ssafy.ssam.domain.consult.controller;

import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.consult.dto.response.ConsultResponseDto;
import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import com.ssafy.ssam.domain.consult.service.ConsultService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/consults")
public class ConsultController {
    private final ConsultService consultService;

    @GetMapping("/{teacherId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointments(@PathVariable Integer teacherId) {
        return ResponseEntity.ok(consultService.getAppointments(teacherId));
    }

    @PostMapping("/{teacherId}")
    public CommonResponseDto createAppointment (@PathVariable Integer teacherId, @Valid @RequestBody AppointmentRequestDto appointmentRequestDto) {
        return new CommonResponseDto("ok");
    }

    @PutMapping("/{consultId}")
    public CommonResponseDto deleteAppointment(@PathVariable Integer consultId) {
        return new CommonResponseDto("ok");
    }

    @GetMapping("/teachers/{consultId}")
    public ResponseEntity<ConsultSummaryDetailResponseDto> getConsults(@PathVariable Integer consultId) {
        return ResponseEntity.ok(consultService.getConsultsAndSummaryDetails(consultId));
    }

//    @PutMapping("/teachers/{consultId}")
//    public ResponseEntity<ConsultSummaryDetailResponseDto> updateConsults(@PathVariable Integer consultId) {
//        return ResponseEntity.ok(consultService.updateConsultsAndSummaryDetails(consultId));
//    }

}
