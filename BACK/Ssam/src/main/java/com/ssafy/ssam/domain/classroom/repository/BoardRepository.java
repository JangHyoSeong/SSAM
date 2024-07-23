package com.ssafy.ssam.classroom.repository;

import com.ssafy.ssam.classroom.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
    boolean existsByPin(String pin);
}
