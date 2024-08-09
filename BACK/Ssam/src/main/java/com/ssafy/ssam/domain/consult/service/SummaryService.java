package com.ssafy.ssam.domain.consult.service;

import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.request.SummaryRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import com.ssafy.ssam.domain.consult.dto.response.SummaryResponseDto;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.entity.Summary;
import com.ssafy.ssam.domain.consult.repository.AppointmentRepository;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.consult.repository.SummaryRepository;
import com.ssafy.ssam.global.amazonS3.service.S3TextService;
import com.ssafy.ssam.global.auth.dto.CustomUserDetails;
import com.ssafy.ssam.global.auth.entity.User;
import com.ssafy.ssam.global.auth.entity.UserRole;
import com.ssafy.ssam.global.auth.repository.UserRepository;
import com.ssafy.ssam.global.chatbot.service.GPTService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SummaryService {
    private final GPTService gptService;
    private final S3TextService s3TextService;
    private final ConsultRepository consultRepository;
    private final AppointmentRepository appointmentRepository;
    private final SummaryRepository summaryRepository;
    private final UserRepository userRepository;

    public CommonResponseDto endConsult(Integer consultId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Consult consult = consultRepository.findByConsultId(consultId).orElseThrow(()->new CustomException(ErrorCode.ConsultNotFountException));

        // 연결된 예약찾아서 주제 가져오기
        Appointment appointment = appointmentRepository.findByAppointmentId(consult.getAppointment().getAppointmentId()).orElseThrow(()->new CustomException(ErrorCode.AppointmentNotFoundException));
        // S3에서 대화 가져오기
        String talk = s3TextService.readText(consult.getWebrtcSessionId());

        // 대화기반 chatGpt 요약
        SummaryRequestDto summaryRequestDto = gptService.GPTsummaryConsult(talk, appointment.getTopic().toString());
        Summary summary = Summary.toSummary(summaryRequestDto, consult);
        summaryRepository.save(summary);
        return new CommonResponseDto("finish consult");
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
}

