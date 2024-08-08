package com.ssafy.ssam.domain.consult.repository;

import com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto;
import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConsultRepository extends JpaRepository<Consult, Integer>{
    // Id 기반으로 존재하는지 여부 검증 jpa
    Optional<Consult> findByConsultId(Integer consultId);

    // 약속을 컨설트로 변환하는 jpa
    List<Consult> findByAppointmentIn(List<Appointment> appointments);


//    @Query("SELECT new com.ssafy.ssam.domain.consult.dto.response.ConsultSummaryDetailResponseDto(c.consultId, c.actualDate, c.runningTime, " +
//            "s.keyPoint, s.profanityCount, s.profanityLevel, s.parentConcern, s.teacherRecommendation, s.followUpDate, " +
//            "a.student.userId, c.attSchool, c.attGrade, c.attClassroom, c.content) " +
//            "FROM Consult c " +
//            "JOIN c.appointment a " +
//            "JOIN Summary s ON s.consult.consultId = c.consultId " +
//            "WHERE c.consultId = :consultId")
//    Optional<ConsultSummaryDetailResponseDto> findConsultSummaryByConsultId(@Param("consultId") Integer consultId);
}
