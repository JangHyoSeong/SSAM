package com.ssafy.ssam.domain.consult.service;

import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.consult.dto.request.ConsultRequestDto;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.user.dto.request.AlarmCreateRequestDto;
import com.ssafy.ssam.domain.user.entity.AlarmType;
import com.ssafy.ssam.domain.user.service.AlarmService;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Builder
@Service
@Transactional
@RequiredArgsConstructor
public class ConsultService {
    private final UserRepository userRepository;
    private final ConsultRepository consultRepository;
    private final BoardRepository boardRepository;
    private final AlarmService alarmService;

    // 상담 시작 시 consult 초기 생성
    @Transactional
    public CommonResponseDto createConsultEntity(Appointment appointment) {

        User student = appointment.getStudent();
        // 더 추가해야함. 머지하고 만들자
        String accessCode = createConsultAccessCode();
        ConsultRequestDto requestDto = ConsultRequestDto.builder()
                .actualDate(LocalDateTime.now())
                .appointment(appointment)
                .accessCode(accessCode)
                .build();
        Consult consult = Consult.toConsult(requestDto);

        // consult accesscode를 담은 알람을 생성
        AlarmCreateRequestDto studentAlarmCreateRequestDto
                = AlarmCreateRequestDto.builder()
                .userId(student.getUserId())
                .alarmType(AlarmType.CONSULT)
                .accessCode(accessCode)
                .build();
        alarmService.creatAlarm(studentAlarmCreateRequestDto);

        return new CommonResponseDto("Consult Created");
    }

//    public ConsultSummaryDetailResponseDto getConsultsAndSummaryDetails(Integer consultId){
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//
//        User user = userRepository.findByUserIdAndRole(userDetails.getUserId(), UserRole.TEACHER)
//                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));
//
//        return consultRepository.findConsultSummaryByConsultId(consultId).orElseThrow(() -> new CustomException(ErrorCode.ConsultNotFountException));
//    }

    // 상담 AccessCode 생성
    public String createConsultAccessCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder accessCode = new StringBuilder();
        Random random = new Random();

        // 7자리 코드 생성(영어 대문자 + 숫자)
        do {
            accessCode.setLength(0); // Clear the StringBuilder
            for (int i = 0; i < 7; i++) {
                accessCode.append(characters.charAt(random.nextInt(characters.length())));
            }
        } while (consultRepository.existsByAccessCode(accessCode.toString()));

        return accessCode.toString();
    }
}