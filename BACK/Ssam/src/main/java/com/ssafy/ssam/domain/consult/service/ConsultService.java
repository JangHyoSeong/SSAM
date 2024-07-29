package com.ssafy.ssam.domain.consult.service;

import com.ssafy.ssam.domain.classroom.dto.request.BoardCreateRequestDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.entity.Board;
import com.ssafy.ssam.domain.consult.controller.ConsultController;
import com.ssafy.ssam.domain.consult.dto.request.AppointmentRequestDto;
import com.ssafy.ssam.domain.consult.dto.request.ConsultRequestDto;
import com.ssafy.ssam.domain.consult.dto.response.AppointmentResponseDto;
import com.ssafy.ssam.domain.consult.dto.response.ConsultResponseDto;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import com.ssafy.ssam.domain.consult.entity.Consult;
import com.ssafy.ssam.domain.consult.repository.AppointmentRepository;
import com.ssafy.ssam.domain.consult.repository.ConsultRepository;
import com.ssafy.ssam.domain.user.entity.User;
import com.ssafy.ssam.domain.user.entity.UserRole;
import com.ssafy.ssam.domain.user.repository.UserRepository;
import com.ssafy.ssam.global.error.CustomException;
import com.ssafy.ssam.global.error.ErrorCode;
import jakarta.persistence.EntityManager;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Builder
@Service
@Transactional
@RequiredArgsConstructor
public class ConsultService {
    private final AppointmentRepository appointmentRepository;
    private final ConsultRepository consultRepository;
    private final UserRepository userRepository;
    private final EntityManager em;

    public AppointmentResponseDto createAppointment(Integer teacherId, AppointmentRequestDto appointmentRequestDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User student = userRepository.findByUsername(authentication.getName());
        // 토큰이 가진 예약자랑 넘겨받은 예약자 값이 다르면 에러
        if(student == null || !student.getUserId().equals(appointmentRequestDto.getStudentId()))
            new CustomException(ErrorCode.UserNotFoundException);

        User teacher = userRepository.findByUserIdAndRole(teacherId, UserRole.TEACHER)
                .orElseThrow(() -> new CustomException(ErrorCode.UserNotFoundException));

        // 상담예약시간이 이전에 지난 시간일 때 에러
        if(appointmentRequestDto.getStartTime().isBefore(LocalDateTime.now()))
            throw new CustomException(ErrorCode.UnavailableDate);

        // 상담예약시간에 이미 예약이 존재하면 에러
        if(appointmentRepository.existsByStatusAndTimeRange(appointmentRequestDto.getStartTime(), appointmentRequestDto.getEndTime()))
            throw new CustomException(ErrorCode.UnavailableDate);

        Appointment appointment = Appointment.toAppointment(teacher, student, appointmentRequestDto);

        // 예약자가 선생님이다 -> 예약 거부 상태 / 아니다 예약 신청
        if(teacher.getUserId().equals(student.getUserId())) appointment.setStatus(AppointmentStatus.REJECT);

        return Appointment.toAppointmentDto(appointmentRepository.save(appointment));
    }
    public AppointmentResponseDto deleteAppointment(Integer appointmentId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByUsername(authentication.getName());
        Appointment appointment = em.find(Appointment.class, appointmentId);

        // 토큰이 가진 예약자가 없는 사람이면 에러
        if(user == null) new CustomException(ErrorCode.UserNotFoundException);
            // 학생일때는 자신 예약만 수정 가능함
        else if(user.getRole().equals(UserRole.STUDENT)){
            if(!appointment.getStudent().equals(user)) throw new CustomException(ErrorCode.Unauthorized);
            appointment.setStatus(AppointmentStatus.CANCEL);
        }
        // 선생님일때는 자신 이름 앞으로 된 예약들 수정 가능함
        else if(user.getRole().equals(UserRole.TEACHER)){
            if(!appointment.getTeacher().equals(user)) throw new CustomException(ErrorCode.Unauthorized);
            appointment.setStatus(AppointmentStatus.CANCEL);
        }
        return Appointment.toAppointmentDto(appointment);
    }
}
