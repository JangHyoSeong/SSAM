package com.ssafy.ssam.domain.consult.service;

import com.ssafy.ssam.domain.classroom.repository.BoardRepository;
import com.ssafy.ssam.domain.consult.dto.request.ConsultRequestDto;
import com.ssafy.ssam.domain.consult.dto.request.SummaryRequestDto;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.entity.Summary;
import com.ssafy.ssam.domain.consult.repository.AppointmentRepository;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.user.dto.request.AlarmCreateRequestDto;
import com.ssafy.ssam.domain.user.entity.AlarmType;
import com.ssafy.ssam.domain.user.service.AlarmService;
import com.ssafy.ssam.domain.consult.repository.SummaryRepository;
import com.ssafy.ssam.domain.user.entity.UserBoardRelation;
import com.ssafy.ssam.domain.user.repository.UserBoardRelationRepository;
import com.ssafy.ssam.global.amazonS3.service.S3TextService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.chatbot.service.GPTSummaryService;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
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
    private final AppointmentRepository appointmentRepository;
    private final SummaryRepository summaryRepository;
    private final UserBoardRelationRepository userBoardRelationRepository;
    private final S3TextService s3TextService;
    private final GPTSummaryService gptSummaryService;
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
    // 학생기준
    public CommonResponseDto startConsult(Integer consultId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User student = userRepository.findByUserId(userDetails.getUserId())
                .orElseThrow(()->new CustomException(ErrorCode.UserNotFoundException));
        UserBoardRelation relation = userBoardRelationRepository.findByBoardIdAndStatus(userDetails.getBoardId())
                .orElseThrow(()->new CustomException(ErrorCode.NotFoundStudentInBoardException));

        // 1. consult 1) 시작시간 2) att 설정
        Consult consult = consultRepository.findByConsultId(consultId).orElseThrow(()->new CustomException(ErrorCode.ConsultNotFountException));
        if(!consult.getAppointment().getStudent().getUserId().equals(student.getUserId())) {
            throw new CustomException(ErrorCode.IllegalArgument);
        }
        // 1)
        consult.setActualDate(LocalDateTime.now());
        // 2)
        consult.setAttSchool(relation.getUser().getSchool().getSchoolId());
        consult.setAttGrade(relation.getBoard().getGrade());
        consult.setAttClassroom(relation.getBoard().getClassroom());

        // 2. appointment 설정
        Appointment appointment = appointmentRepository.findByAppointmentId(consult.getAppointment().getAppointmentId()).orElseThrow(()->new CustomException(ErrorCode.AppointmentNotFoundException));
        appointment.setStatus(AppointmentStatus.DONE);

        return new CommonResponseDto("start consult");
    }
    // 학생기준
    public CommonResponseDto endConsult(Integer consultId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 1. consult 종료시간 기준으로 1) runningtime 수정, 2) S3에서 대화 가져오기 3) content 입력
        Consult consult = consultRepository.findByConsultId(consultId).orElseThrow(()->new CustomException(ErrorCode.ConsultNotFountException));
        // 1)
        consult.setRunningTime((int)Duration.between(consult.getActualDate(), LocalDateTime.now()).toMinutes());
        // 2)
        String talk = s3TextService.readText(consult.getWebrtcSessionId());
        // 3)
        consult.setContent(talk);

        // 2. GPT 입력 1) 연결된 예약찾아서 주제 가져오기 2) 주제, 대화기반 chatGpt 요약
        // 1)
        Appointment appointment = appointmentRepository.findByAppointmentId(consult.getAppointment().getAppointmentId()).orElseThrow(()->new CustomException(ErrorCode.AppointmentNotFoundException));
        // 2)
        SummaryRequestDto summaryRequestDto = gptSummaryService.GPTsummaryConsult(talk, appointment.getTopic().toString());
        Summary summary = Summary.toSummary(summaryRequestDto, consult);
        summaryRepository.save(summary);

        return new CommonResponseDto("end consult");
    }

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