package com.ssafy.ssam.domain.classroom.repository;

import com.ssafy.ssam.domain.classroom.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolRepository extends JpaRepository<School, Integer> {
}
