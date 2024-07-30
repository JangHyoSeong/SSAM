package com.ssafy.ssam.domain.consult.controller;

import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.consult.service.ConsultService;
import com.ssafy.ssam.global.error.ErrorCode;
import com.ssafy.ssam.global.error.exception.BindingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/consults")
public class ConsultController {
    private final ConsultService consultService;
    // 상담가능 날짜는 넘어오는 데이터를 잘 모르겠어서 나중에 하겟씁니다
    // 상담신청 넘어오는 데이터 아마도 선생Id, 학부모Id, 날짜시간 데이터

//    @PostMapping("/{teacherId}")
//    public ResponseEntity<AppointmentResponseDto> createAppointment (@PathVariable Integer teacherId, @Valid @RequestBody AppointmentRequestDto appointmentRequestDto, BindingResult bindingResult) {
//        log.info("Creating appointment for teacher id {}", teacherId);
//        log.info("Creating appointment for AppointmentRequestDto {}", appointmentRequestDto);
//        if(bindingResult.hasErrors()) throw new BindingException(ErrorCode.BINDING_ERROR,bindingResult.getFieldError().getDefaultMessage());
//        return ResponseEntity.ok(consultService.createAppointment(teacherId, appointmentRequestDto));
//    }

    @PostMapping("/{teacherId}")
    public ResponseEntity<AppointmentResponseDto> createAppointment (@PathVariable Integer teacherId, @Valid @RequestBody AppointmentRequestDto appointmentRequestDto) {
        return ResponseEntity.ok(consultService.createAppointment(teacherId, appointmentRequestDto));
    }

    @PutMapping("/{consultId}")
    public ResponseEntity<AppointmentResponseDto> deleteAppointment(@PathVariable Integer consultId) {
        return ResponseEntity.ok(consultService.deleteAppointment(consultId));
    }

}
