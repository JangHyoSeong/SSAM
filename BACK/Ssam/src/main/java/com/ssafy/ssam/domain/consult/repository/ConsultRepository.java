package com.ssafy.ssam.domain.consult.repository;

import com.ssafy.ssam.domain.consult.entity.Consult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultRepository extends JpaRepository<Consult, Integer>{
    // Id 기반으로 존재하는지 여부 검증 jpa
    Consult findById(int id);
}
