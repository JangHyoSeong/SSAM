package com.ssafy.ssam.domain.consult.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.Consult;

public interface ConsultRepository extends JpaRepository<Consult, Integer>{
    // Id 기반으로 존재하는지 여부 검증 jpa
    Consult findById(int id);
    Optional<Consult> findByAccessCode(String accessCode);
    // 약속을 컨설트로 변환하는 jpa
    List<Consult> findByAppointmentIn(List<Appointment> appointments);
}
