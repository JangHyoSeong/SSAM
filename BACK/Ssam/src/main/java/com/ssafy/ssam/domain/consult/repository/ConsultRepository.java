package com.ssafy.ssam.domain.consult.repository;


import java.util.List;
import java.util.Optional;

import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConsultRepository extends JpaRepository<Consult, Integer>{
    // Id 기반으로 존재하는지 여부 검증 jpa
    Optional<Consult> findByConsultId(int id);
    Optional<Consult> findByAccessCode(String accessCode);
    // 약속을 컨설트로 변환하는 jpa
    List<Consult> findByAppointmentIn(List<Appointment> appointments);


    @Query("SELECT new com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto(c.consultId, c.actualDate, c.runningTime, c.content, " +
            "c.attSchool, c.attGrade, c.attClassroom, "+
            "s.keyPoint, s.profanityCount, s.profanityLevel, s.parentConcern, s.teacherRecommendation, " +
            "a.student.userId, a.topic) " +
            "FROM Consult c " +
            "JOIN Appointment a ON a.appointmentId = c.appointment.appointmentId " +
            "JOIN Summary s ON s.consult.consultId = c.consultId " +
            "WHERE c.consultId = :consultId")
    Optional<ConsultSummaryDetailResponseDto> findConsultSummaryByConsultId(@Param("consultId") Integer consultId);
}